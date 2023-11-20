import axios from 'axios';
import { tansParams } from './utils';
// type
import type {
    CreateAxiosDefaults,
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosRequestConfig,
} from 'axios';
import type { IResData } from './type';

const getRequest = (
    config: CreateAxiosDefaults,
    getToken: () => string | undefined | null,
    //退出登录执行的方法
    logout: () => void,
) => {
    //设置默认请求头
    axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

    // 创建axios实例
    const service: AxiosInstance = axios.create(config);
    const axiosMap = new Map<string, number>();
    const gapTime = 1000;

    // 请求拦截
    service.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            // 是否需要设置 token
            const isToken = (config.headers || {}).isToken === false;
            // 是否需要防止数据重复提交
            const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
            //
            if (getToken() && !isToken) {
                config.headers['Authorization'] = getToken();
            }
            // 设置时间戳
            config.headers['ts'] = new Date().getTime();
            // get请求映射params参数
            if (config.method === 'get' && config.params) {
                let url = config.url + '?' + tansParams(config.params);
                url = url.slice(0, -1);
                config.params = {};
                config.url = url;
            }
            // 防止数据重复提交
            if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
                const requestObj = {
                    url: config.url,
                    data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
                };

                const key = JSON.stringify(requestObj);

                if (axiosMap.has(key)) {
                    //存在相同的key，判断value的时间差
                    const time = axiosMap.get(key)!;
                    if (new Date().getTime() - time < gapTime) {
                        const message = '数据正在处理，请勿重复提交';
                        // TyNotificationWarn({
                        //     title: '请稍后',
                        //     message
                        // })
                        console.warn(`[${config.url}]: ` + message);
                        axiosMap.set(key, new Date().getTime());
                        return Promise.reject(new Error(message));
                    } else {
                        axiosMap.set(key, new Date().getTime());
                    }
                } else {
                    axiosMap.set(key, new Date().getTime());
                }
            }

            return config;
        },
        (error: any) => {
            console.error('请求拦截报错：', error);
            // 对请求错误做些什么
            return Promise.reject({
                msg: '请求拦截报错!',
                error,
            });
        },
    );

    // 响应拦截
    service.interceptors.response.use(
        (res: AxiosResponse<IResData>) => {
            // 未设置状态码则默认成功状态
            const code = res.data.code || 200;
            if (code === 200) {
                return Promise.resolve(res);
            }
            // 身份验证失败
            if (code === 401) {
                logout();
                return Promise.reject(res);
            }

            return Promise.reject(res);
        },
        (err: any) => {
            console.error('err' + err);
            let { message } = err;
            if (message === 'Network Error') {
                message = '后端接口连接异常';
            } else if (message.includes('timeout')) {
                message = '系统接口请求超时';
            } else if (message.includes('Request failed with status code')) {
                message = '系统接口' + message.substr(message.length - 3) + '异常';
            }
            console.error(message);
            return Promise.reject(err);
        },
    );

    /**
     * @description 封装好的请求方法，有类型提示
     * @param { AxiosRequestConfig } config 配置项
     * @return { Promise<IResData<T>> } 返回一个Promise
     */
    function request<T>(config: AxiosRequestConfig): Promise<IResData<T>> {
        return new Promise((resolve, reject) => {
            service<IResData<T>>(config)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err: any) => {
                    reject(err?.data);
                });
        });
    }

    return request;
};

export { getRequest };
export type { IResData };
