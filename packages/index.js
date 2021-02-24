import IDEColorPicker from './IDEColorPicker/index';
import IDERelation from './IDERelation/index';
import IDEDataDialog from './IDEDataDialog/index';
import IDETextStyle from './IDETextStyle/index';
import IDENumberRock from './IDENumberRock/index';
import IDEDataFilter from './IDEDataFilter/index';


const components = [
	IDEColorPicker,
	IDERelation,
	IDEDataDialog,
	IDETextStyle,
	IDENumberRock,
	IDEDataFilter
]

const install = function(Vue) {
	if(install.installed) return
	install.installed = true
	components.map(component => {
		Vue.component(component.name, component)
	})
}

if(typeof window !== 'undefined' && window.Vue) {
	// window.Vue.use(install)
	install(window.Vue)
}
function uuid(len, radix) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
        i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random() * radix]
        }
    } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

export default {
	install,
	IDEColorPicker,
	IDERelation,
	IDEDataDialog,
	IDETextStyle,
	IDENumberRock,
	IDEDataFilter,
	uuid
}