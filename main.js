import {TsGoogleDrive} from "ts-google-drive";
import {google} from "googleapis";
import pkg from "ftp-srv";
const {FtpSrv} = pkg;
import {unlink} from 'node:fs/promises';
import { exit } from 'node:process';

let google_folderid = "";
if (process.env.GDRIVE_FOLDERID!="") {
	google_folderid = process.env.GDRIVE_FOLDERID;
} else {
	console.log("Folderid is not set.");
	exit();
}
let google_email = "";
if (process.env.GDRIVE_EMAIL!="") {
	google_email = process.env.GDRIVE_EMAIL;
} else {
	console.log("Email is not set.");
	exit();
}
let google_private_key = "";
if (process.env.GDRIVE_PRIVATE_KEY!="") {
	google_private_key = process.env.GDRIVE_PRIVATE_KEY.replaceAll("\\n","\n");
} else {
	console.log("Private key is not set.");
	exit();
}

let ftp_port=21;
if (process.env.FTP_PORT) {
    ftp_port = parseInt(process.env.FTP_PORT);
}
let ftp_user = 'ftp';
if (process.env.FTP_USER) {
    ftp_user = process.env.FTP_USER;
}
let ftp_password = 'password';
if (process.env.FTP_PASSWORD) {
    ftp_password = process.env.FTP_PASSWORD;
}

const drive = new TsGoogleDrive({credentials: {client_email: google_email, private_key: google_private_key}});

const ftpServer = new FtpSrv({
    url: "ftp://0.0.0.0:" + ftp_port,
    anonymous: false
});

ftpServer.listen().then(() => { 
    console.log('Ftp server started...')
});

ftpServer.on('login', ({ connection, username, password }, resolve, reject) => { 

	connection.on('STOR', async (error, fileName) => {
		console.log(fileName + " was uploaded to temp storage");
		await drive.upload(fileName, {parent: google_folderid});
		console.log(fileName + " was uploaded to google drive");
		unlink(fileName, (err) => {
			if (err) throw err;
		});
	});

    if(username === ftp_user && password === ftp_password){
        return resolve({ root:"./storage/" });
    }
    return reject(new errors.GeneralError('Invalid username or password', 401));
});
