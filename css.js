import { render } from "node-sass";
export const renderSass = (options) => new Promise((resolve, reject) => render(options, (err, res) => {
	console.log("options:"+JSON.stringify(options));
    if (err){
		///console.log("error");
        return reject(err);
	}
	//console.log("all good:"+JSON.stringify(res));
    return resolve(res);
}));