//TODO:路径确认处理
//optionsType设置在webpack.config.js 中 optionsType:JSON.stringify(0) 设置
let Options;
switch (optionsType) {
    case 1:
        Options = {
            baseUrl: '//review.4006688991.com/',
            pathImage: 'pixi/asset/image/',
            pathVideo: 'pixi/asset/video2/',
            pathTxt: 'pixi/asset/txt/',
            pathAudio: 'pixi/asset/sound/',
            pathJson: 'pixi/asset/json/',
            pathFilters: 'pixi/asset/filters/'
        };
        break;
    case 2:
        Options = {
            baseUrl: '',
            pathImage: '/upload/Image/',
            pathVideo: '/upload/Video/',
            pathTxt: '/upload/AnimationJson/',
            pathJson: '/upload/json/',
            pathAudio: '/upload/Audio/',
            pathFilters: '/upload/filters/'
        };
        break;
    case 3:
        Options = {
            baseUrl: '',
            pathImage: '/upload/Image/',
            pathVideo: '/upload/Video/',
            pathJson: '/upload/json/',
            pathTxt: '/upload/AnimationJson/',
            pathAudio: '/upload/Audio/',
            pathFilters: '/upload/filters/'
        };
        break;
    case 4:
        Options = {
            baseUrl: '',
            pathImage: '/asset/Image/',
            pathVideo: '/asset/Video/',
            pathTxt: '/asset/txt/',
            pathAudio: '/asset/Audio/',
            pathFilters: '/asset/filters/',
            pathJson: '/asset/json/'
        };
        break;
    case 5:
        Options = {
            baseUrl: '//dev.test.com',
            pathImage: '/upload/Image/',
            pathVideo: '/upload/Video/',
            pathTxt: '/upload/AnimationJson/',
            pathJson: '/upload/json/',
            pathAudio: '/upload/Audio/',
            pathFilters: '/upload/filters/'
        };
        break;
    default:
        Options = {
            baseUrl: '//review.4006688991.com/',
            pathImage: 'pixi/asset/image/',
            pathVideo: 'pixi/asset/video2/',
            pathTxt: 'pixi/asset/txt/',
            pathAudio: 'pixi/asset/sound/',
            pathJson: 'pixi/asset/json/',
            pathFilters: 'pixi/asset/filters/'
        };
}

export default {
    Options
};