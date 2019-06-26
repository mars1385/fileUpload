//imports
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
//end
const app = express();
app.use(fileUpload());
//uploaded file end point
app.post('/api/upload', (req, res) => {
	
	if (req.files === null) {
		return res.status(400).json({ msg: 'File not uploaded' });
	}
	
	const uploadedFile = req.files.uploadedFile;
		uploadedFile.mv(
			`${__dirname}/client/public/uploads/${uploadedFile.name}`,
			err => {
				if (err) {
					return res.status(500).send(err);
				}
				res.json({
					fileName: uploadedFile.name,
					filePath: `/uploads/${uploadedFile.name}`
				});
			}
		);
	
});

app.get('/api/upload' , (req , res) => {
	const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
	const directoryPath = path.join(__dirname, '/client/public/uploads/');
	fs.readdir(directoryPath, function (err, files) {
			//handling error
			if (err) {
					return res.status(400).json('Unable to scan directory: ' + err);
			} 
			//listing all images 
			const images = files.filter(file => allowedExtensions.exec(file));
			res.json(images);
	});

})
//running server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`server is running on port : ${port}`);
});
