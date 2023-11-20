// 获取验证码
// {"code":200,"msg":"获取成功", "b64": "", "tb64": "", "key": ""}
import { request } from '@/utils';

function getCaptcha() {
    return request({
        url: '/user/captcha',
        headers: {
            isToken: false,
        },
        method: 'get',
        timeout: 20000,
    });
}

export { getCaptcha };
