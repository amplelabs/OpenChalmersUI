const getStage = () => {
    let result;
    switch (process.env.NODE_ENV) {
      case 'production':
        result = '';
        break;
      case 'staging':
        result = '.staging';
        break;
      case 'development':
        result = '.dev';
        break;
      default:
        result = '.dev'
        break;
    }
    return result;
  };
  export default getStage;
