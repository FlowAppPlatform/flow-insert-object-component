var Q = require('q');

var Component = require('./insert');

/*
 * 
 * To run all tests,
 * 
 * replace appId, clientKey, table with your own
 * 
 */

const appId       = '',
      clientKey   = '',
      table       = '';

describe(`Component Tests
`, function () {
  
  const APP_ID = 'APP_ID';
  const CLIENT_KEY = 'CLIENT_KEY';
  const TABLE = 'Table';

  const Graph = require('flow-platform-sdk').Graph;

  it('Component should execute without errors', function (done) {
    try {
      const Component = require('./insert');
      const component = new Component();

      component.getProperty('APP_ID').data = APP_ID;
      component.getProperty('CLIENT_KEY').data = CLIENT_KEY;
      component.getProperty('Table').data = TABLE;

      component.getProperty('Data').data = [{ name: 'Jonah Dillingham' }];

      component.getPort('Success').onEmit(function(){
        done();
      });
      component.getPort('Error').onEmit(function(){
        done(component.getPort('Error').getProperty('Data').data);
      });

      new Graph("graph-1").addComponent(component);
      component.execute();

    } catch(e) { done(e); }
  })
  it('Component should have all required ports', function (done) {
    try {
      component = new Component();
      component.getPort('Success');
      component.getPort('Error');
      done();
    } catch(e) { done(new Error('Component missing required ports')); }
  })
})

if (!(appId && clientKey && table)) return

function save(name) {
  const d = Q.defer();
  try {

    const component = new Component();
    
    component.getProperty('APP_ID').data = appId;
    component.getProperty('CLIENT_KEY').data = clientKey;
    component.getProperty('Table').data = table;
    component.getProperty('Documents').data = [{ 
        name: name
    }];

    component.getPort('Success').onEmit(function() {
      d.resolve(/* component.getPort('Success').getProperty('Result').data */);
    });
    component.getPort('Error').onEmit(function() {
      d.reject(new Error('Emit returned error'));
    });
    component.execute();
    
  } catch(e) { d.reject(e); }
  return d.promise;
}

describe(`API Tests
`, function () {
  it('Component should save documents', function (done) {
    save('Chess').then(
      function() { done(); },
      function(e) { done(e); }
    );
  })
})