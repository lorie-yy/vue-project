let baseUrl;
if (process.env.NODE_ENV === 'production') {
    baseUrl = '//learn.4006688991.com';
} else {
    // baseUrl = 'http://192.168.3.56';
    // baseUrl = 'http://192.168.3.56';
    baseUrl = '//learn.4006688991.com';
}

export {
    baseUrl
};