import  './button.scss';
 /**
 * @injectHTML
 */
export class Button{
	static set cssStyleSheet(inStyle) {	
		console.log('super_button',"inStyle:"+inStyle);	
		this.styles = inStyle;
	}
}