//imports
import React from 'react';
import FileUploader from './components/file-upload/FileUploader';

const App = () => {
	return (
		<div className='container mt-4 '>
			<h4 className='display-4 text-center mb-5'>
				<i className='fab fa-react' />
				React File Upload!
			</h4>
			<FileUploader />
		</div>
	);
};

export default App;
