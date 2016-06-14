'use strict';
const fs   = require('co-fs');
const path = require('path');
const Method = 'GET,POST,PUT,DELETE';

class Doc {
  constructor () {
  }
  get (doc) {
    if (Object.prototype.toString.call(doc) !== '[object Object]') {
      return []
    }
    let docArray = []
    let _temp
    for (let i in doc) {
      _temp = doc[i]
      if (Object.prototype.toString.call(_temp) === '[object Function]') {
        // 只有是GET,POST,PUT,DELETE，才需要输出文档
        if (!!Method.match(i)) {
          _temp = String(_temp)
          // 提取注释内容    |(?:([\s;])+\/\/(?:.*)$)
          _temp = _temp.match(/(?:\/\*(?:[\s\S]*?)\*\/)/gm)
          if( !!_temp ){
            _temp = _temp[0].replace(/(\/\*|\*\/)/gi, '')
            docArray.push( _temp )
          }
        }
      }
      // 循环提取内部对象方法，暂时不需要
      //  else {
      //  _temp = this.get(_temp);
      //  docArray = docArray.concat(_temp);
      // }
    }
    return docArray;
  }
}
let docObj = new Doc()

module.exports = {
  GET: function *() {
    let doc = yield fs.readFile(path.join(__dirname, 'doc.md'), 'utf-8')
    yield this.render('doclist', {
      layout: 'doclist',
      err: (!!doc ? ''  : '接口文档不存在'),
      doc: (!!doc ? doc : '')
    })
  },
  ITEM: {
    GET: function *() {
      try {
        let doc = require(path.join(__dirname, this.params[0]))
        doc = docObj.get(doc)
        if (doc.length === 0) {
          throw new Error('文档不能为空')
        }
        yield this.render('doc', {
          layout: 'doc',
          doc: doc,
          err: ''
        })
      } catch (err) {
        yield this.render('doc', {
          layout: 'doc',
          err: '接口文档不存在',
          doc: []
        })
      }
      
    }
  }
}
