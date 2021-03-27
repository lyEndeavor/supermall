import axios from 'axios'

export function request(config){
  //1.创建axios实例
  const instance = axios.create({
    baseURL:'http://152.136.185.210:7878/api/m5',
    timeout:5000
  })

  //2.axios的拦截器
   //2.1拦截请求
  instance.interceptors.request.use(config =>{
    //拦截成功

    //拦截后记得将config返回
    return config
  },err => {
    // console.log(err)
  })

   //2.2拦截响应
  instance.interceptors.response.use(res => {
    // console.log(res);
    
    //拦截完后记得将data返回
    return res.data
  },err =>{
    // console.log(err)
  })

  //3.发送真正的网络请求
  return instance(config)
}
