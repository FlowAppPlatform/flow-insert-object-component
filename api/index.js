var CB = global.CB || require('cloudboost');

// omit for production
if (process.env.NODE_ENV !== 'production')
  CB.apiUrl   = 'http://localhost:4730';

class API {

  constructor(APP_ID, CLIENT_KEY, TABLE) {
    this.APP_ID = APP_ID;
    this.CLIENT_KEY = CLIENT_KEY;
    this.TABLE = TABLE;

    if (process.env.NODE_ENV === 'testing') return;
    this.CB = CB;
    this.CB.CloudApp.init(this.APP_ID, this.CLIENT_KEY);
  }

  save(documents=[]) {
    /* Support tests to this point */
    if (process.env.NODE_ENV === 'testing') return new Promise(
      resolve => resolve(JSON.stringify({}))
    );
    if (!documents.length) return new Error('No documents specified');
    const objects = documents.map(document => {
      const object = new this.CB.CloudObject(this.TABLE);
      // ignore dynamic properties
      Object.keys(document).forEach(key => key.charAt(0) !== '@' && object.set(key, document[key]));
      return object;
    });
    return this.CB.CloudObject.saveAll(objects);
  }

}

module.exports = API;