Ext.define('Kort.store.NewsLocal', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Kort.model.News',
        proxy: {
            type:'localstorage',
            id:'newsItems'
        },
        sorters: [
            {
                property: 'updated',
                direction: 'DESC'
            }
        ],
        filters: [
            {
                filterFn: function(item) {
                    return Ext.getStore('UserLocal').getAt(0).get('newsAcceptedLanguageArray').some(function(lang){return lang === item.get('lang')});
                }
            }
        ],
        grouper:
            {
            groupFn: function(record) {
                return record.get('unread') ? Ext.i18n.Bundle.message('news.unread') : Ext.i18n.Bundle.message('news.read');
            },
            direction: 'DESC'
            }
   },

    getAmountOfUnreadNews: function(){
    var count=0;
    this.each(function (item, index, length) {
        if(item.get('unread')==true) {
            count++;
        }
    });
    return count;
    }
});
