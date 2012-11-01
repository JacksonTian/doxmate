/*
 * lunr.js version: 0.0.4
 * (c) 2011 Oliver Nightingale
 *
 * Released under MIT license.
 */ 
var Lunr=function(c,f){var b=new Lunr.Index(c);f.call(b,b);return b};
    Lunr.utils={uniq:function(c){if(!c)return[];return c.reduce(function(c,b){c.indexOf(b)===-1&&c.push(b);return c},[])},intersect:function(c){var f=[].slice.call(arguments,1);return this.uniq(c).filter(function(b){return f.every(function(a){return a.indexOf(b)>=0})})},detect:function(c,f,b){for(var a=c.length,g=null,d=0;d<a;d++)if(f.call(b,c[d],d,c)){g=c[d];break}return g},copy:function(c){return Object.keys(c).reduce(function(f,b){f[b]=c[b];return f},{})}};
    Lunr.Trie=function(){var c=function(){this.children={};this.values=[]};c.prototype={childForKey:function(b){var a=this.children[b];a||(a=new c,this.children[b]=a);return a}};var f=function(){this.root=new c};f.prototype={get:function(b){var a=this;return this.keys(b).reduce(function(c,d){a.getNode(d).values.forEach(function(a){a=Lunr.utils.copy(a);if(b===d)a.exact=!0;c.push(a)});return c},[])},getNode:function(b){var a=function(b,d){if(!d.length)return b;return a(b.childForKey(d.charAt(0)),d.slice(1))};
    return a(this.root,b)},keys:function(b){var a=[];b=b||"";var c=function(b,e){b.values.length&&a.push(e);Object.keys(b.children).forEach(function(a){c(b.children[a],e+a)})};c(this.getNode(b),b);return a},set:function(b,a){var c=function(b,e){if(!e.length)return b.values.push(a);c(b.childForKey(e.charAt(0)),e.slice(1))};return c(this.root,b)}};return f}();Lunr.Index=function(c){this.name=c;this.refName="id";this.fields={};this.trie=new Lunr.Trie};
    Lunr.Index.prototype={add:function(c){(new Lunr.Document(c,this.refName,this.fields)).words().forEach(function(c){this.trie.set(c.id,c.docs[0])},this)},field:function(c,f){this.fields[c]=f||{multiplier:1}},ref:function(c){this.refName=c},search:function(c){if(!c)return[];c=c.split(" ").map(function(c){c=new Lunr.Word(c);if(!c.isStopWord())return c.toString()}).filter(function(c){return c}).map(function(c){return this.trie.get(c).sort(function(b,a){if(b.exact&&a.exact===void 0)return-1;if(a.exact&&
    b.exact===void 0)return 1;if(b.score<a.score)return 1;if(b.score>a.score)return-1;return 0}).map(function(b){return b.documentId})},this);return Lunr.utils.intersect.apply(Lunr.utils,c)}};Lunr.Document=function(c,f,b){this.original=c;this.fields=b;this.ref=c[f]};
    Lunr.Document.prototype={asJSON:function(){return{id:this.ref,words:this.words().map(function(c){return c.id}),original:this.original}},words:function(){var c=this,f={};Object.keys(this.fields).forEach(function(b){c.original[b].split(/\b/g).filter(function(a){return!!a.match(/\w/)}).map(function(a){a=new Lunr.Word(a);if(!a.isStopWord())return a.toString()}).filter(function(a){return a}).forEach(function(a){f[a]||(f[a]={score:0,ref:c.ref});f[a].score+=c.fields[b].multiplier})});return Object.keys(f).map(function(b){return{id:b,
    docs:[{score:f[b].score,documentId:c.ref}]}})}};Lunr.Word=function(c){this.raw=c;this.out=this.raw.replace(/^\W+/,"").replace(/\W+$/,"").toLowerCase()};Lunr.Word.stopWords=["the","of","to","and","a","in","is","it","you","that","this"];
    Lunr.Word.prototype={isStopWord:function(){return Lunr.Word.stopWords.indexOf(this.raw.toLowerCase())!==-1},toString:function(){if(!this.isStopWord())return this.stem(),this.out},stem:function(){var c={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},f={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",
    ful:"",ness:""};return function(){var b,a,g,d=g=this.out;if(g.length<3)return g;var e,h;g=g.substr(0,1);g=="y"&&(d=g.toUpperCase()+d.substr(1));e=/^(.+?)(ss|i)es$/;a=/^(.+?)([^s])s$/;e.test(d)?d=d.replace(e,"$1$2"):a.test(d)&&(d=d.replace(a,"$1$2"));e=/^(.+?)eed$/;a=/^(.+?)(ed|ing)$/;e.test(d)?(a=e.exec(d),e=/^([^aeiou][^aeiouy]*)?[aeiouy][aeiou]*[^aeiou][^aeiouy]*/,e.test(a[1])&&(e=/.$/,d=d.replace(e,""))):a.test(d)&&(a=a.exec(d),b=a[1],a=/^([^aeiou][^aeiouy]*)?[aeiouy]/,a.test(b)&&(d=b,a=/(at|bl|iz)$/,
    h=/([^aeiouylsz])\1$/,b=/^[^aeiou][^aeiouy]*[aeiouy][^aeiouwxy]$/,a.test(d)?d+="e":h.test(d)?(e=/.$/,d=d.replace(e,"")):b.test(d)&&(d+="e")));e=/^(.+?)y$/;e.test(d)&&(a=e.exec(d),b=a[1],e=/^([^aeiou][^aeiouy]*)?[aeiouy]/,e.test(b)&&(d=b+"i"));e=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;e.test(d)&&(a=e.exec(d),b=a[1],a=a[2],e=/^([^aeiou][^aeiouy]*)?[aeiouy][aeiou]*[^aeiou][^aeiouy]*/,e.test(b)&&(d=b+c[a]));
    e=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;e.test(d)&&(a=e.exec(d),b=a[1],a=a[2],e=/^([^aeiou][^aeiouy]*)?[aeiouy][aeiou]*[^aeiou][^aeiouy]*/,e.test(b)&&(d=b+f[a]));e=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;a=/^(.+?)(s|t)(ion)$/;e.test(d)?(a=e.exec(d),b=a[1],e=/^([^aeiou][^aeiouy]*)?[aeiouy][aeiou]*[^aeiou][^aeiouy]*[aeiouy][aeiou]*[^aeiou][^aeiouy]*/,e.test(b)&&(d=b)):a.test(d)&&(a=a.exec(d),b=a[1]+a[2],a=/^([^aeiou][^aeiouy]*)?[aeiouy][aeiou]*[^aeiou][^aeiouy]*[aeiouy][aeiou]*[^aeiou][^aeiouy]*/,
    a.test(b)&&(d=b));e=/^(.+?)e$/;if(e.test(d)&&(a=e.exec(d),b=a[1],e=/^([^aeiou][^aeiouy]*)?[aeiouy][aeiou]*[^aeiou][^aeiouy]*[aeiouy][aeiou]*[^aeiou][^aeiouy]*/,a=/^([^aeiou][^aeiouy]*)?[aeiouy][aeiou]*[^aeiou][^aeiouy]*([aeiouy][aeiou]*)?$/,h=/^[^aeiou][^aeiouy]*[aeiouy][^aeiouwxy]$/,e.test(b)||a.test(b)&&!h.test(b)))d=b;e=/ll$/;a=/^([^aeiou][^aeiouy]*)?[aeiouy][aeiou]*[^aeiou][^aeiouy]*[aeiouy][aeiou]*[^aeiou][^aeiouy]*/;e.test(d)&&a.test(d)&&(e=/.$/,d=d.replace(e,""));g=="y"&&(d=g.toLowerCase()+
    d.substr(1));this.out=d}}()};

/* 页面逻辑搜索 */
var idx = Lunr('methods', function () {
  this.ref('id')
  this.field('name', { multiplier: 10 })
  this.field('parent', { multiplier: 5 })
  this.field('full_description')
})

var methods = raw.reduce(function (memo, module) {
  return memo.concat(module.methods)
}, [])

methods.forEach(function (method) {
  idx.add(method)
})

$(document).ready(function () {

  var search = function (term) {
    return idx.search(term).map(function (id) {
      return methods.filter(function (method) {
        return method.id === id
      })[0]
    })
  }

  var getNodeTop=function(elm){
    var top=elm.offsetTop;
    var parent=elm.offsetParent;
    while(parent!==null){
      top+=parent.offsetTop;
      parent=parent.offsetParent;
    }
    return top;
  }
  var resultClick=function(event){
    var offset=event.data.offset;
    offset=offset-140>0?offset-140:0;
    document.documentElement.scrollTop=offset;
    document.body.scrollTop=offset;
    event.preventDefault();
    searchResults.empty();
  }

  var methodNodes=$('.method');
  var methodsTop={};
  for(var i=0,l=methods.length;i<l;i++){
    methodsTop[methodNodes[i].id]=getNodeTop(methodNodes[i]);
  }

  var searchResults = $('#search-results');

  $('#search-input').keyup(function () {
    var query = $(this).val(),
        results = search(query)

    if (!results.length) {
      searchResults.empty()
      return
    };
    var resultsList = results.reduce(function (ul, result) {
      var a=$('<a>',{target:result.parent+'_'+result.name,href:'#',text:result.name});
      $(a).bind('click',{'offset':methodsTop[result.parent+'_'+result.name]},resultClick);
      var li = $('<li>').append(a);

      ul.append(li)

      return ul
    }, $('<ul>'))

    searchResults.html(resultsList)
  })
})