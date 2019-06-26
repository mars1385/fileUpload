//imports
import React, { Fragment, useState } from 'react';
import axios from 'axios';
import Message from '../message/Message';
import Progress from '../progress-bar/Progress';

const FileUploader = () => {
	//state
	const [uploadingFile, setUploadingFile] = useState('');
	const [uploadingFileName, setUploadingFileName] = useState('Choose file');
	const [uploadedFile, setUploadedFile] = useState({});
	const [message, setMessage] = useState('');
	const [uploadP, setUploadP] = useState(0);
	const [images, setImages] = useState([]);
	//end

	//input file onchange
	const onChange = e => {
		if (e.target.files[0]) {
			setUploadingFileName(e.target.files[0].name);
			setUploadingFile(e.target.files[0]);
		}
	};
	//images
	const onImages = async () => {
		try {
			const res = await axios.get('/api/upload');
			setImages(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	//uploading file
	const onUploadFile = async e => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('uploadedFile', uploadingFile);
		try {
			const res = await axios.post('/api/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				onUploadProgress: ProgressEvent => {
					setUploadP(parseInt(Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)));
					setTimeout(() => setUploadP(0), 2000);
				}
			});
			const { fileName, filePath, type } = res.data;
			setUploadedFile({ fileName, filePath, type });
			setMessage('File Uploaded');
		} catch (error) {
			if (error.response.status === 500) {
				setMessage('There is a problem with server');
			} else {
				setMessage(error.response.data.msg);
			}
		}
	};
	return (
		<Fragment>
			{message ? <Message msg={message} /> : null}
			<form onSubmit={onUploadFile}>
				<div className='custom-file mb-4'>
					<input type='file' className='custom-file-input' id='customFile' onChange={onChange} />
					<label className='custom-file-label' htmlFor='customFile'>
						{uploadingFileName}
					</label>
				</div>
				<Progress percentage={uploadP} />
				<input type='submit' value='Upload' className='btn btn-primary btn-block mt-4' />
			</form>
			{/*  */}
			<button
				type='button'
				className='btn btn-outline-success btn-block mt-4'
				data-toggle='modal'
				data-target='.bd-example-modal-xl'
				onClick={onImages}>
				Your Uploaded Image
			</button>
			<div
				className='modal fade bd-example-modal-xl'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='myExtraLargeModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog modal-xl'>
					<div className='modal-content'>
						<div className='row'>
							{images.length > 0 ? (
								images.map((image, index) => (
									<div key={index} className='col-md-4 my-1 '>
										<img
											onClick={() =>
												setUploadedFile({
													fileName: image,
													filePath: `/uploads/${image}`
												})
											}
											key={index}
											src={`/uploads/${image}`}
											alt=''
											style={{ width: '100%', height: '100%' }}
										/>
									</div>
								))
							) : (
								<div className='col-md-6 m-auto'>
									<h1 className='text-danger text-center'>There is no image. Please upload a image</h1>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{/*  */}
			{uploadedFile ? (
				<div className='row mt-5'>
					<div className='col-md-6 m-auto'>
						<h3 className='text-center'>{uploadedFile.fileName}</h3>
						{Object.entries(uploadedFile).length !== 0 ? (
							<h3 className='text-center'>{`Your File URL : ${window.location.href}${
								uploadedFile.filePath
							}`}</h3>
						) : null}
						<img src={uploadedFile.filePath} alt='' style={{ width: '100%' }} />
					</div>
				</div>
			) : null}
		</Fragment>
	);
};

export default FileUploader;
