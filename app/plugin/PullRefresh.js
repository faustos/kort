Ext.define('Kort.plugin.PullRefresh', {
    extend: 'Ext.plugin.PullRefresh',
    alias: 'plugin.kortpullrefresh',
	
	config: {
        pullRefreshText: Ext.i18n.Bundle.message('pullrefresh.pullrefresh'),
        loadingText: Ext.i18n.Bundle.message('pullrefresh.loading'),
        releaseRefreshText: Ext.i18n.Bundle.message('pullrefresh.releaserefresh'),
        lastUpdatedText: Ext.i18n.Bundle.message('pullrefresh.lastupdated'),
        dateFormat: 'd.m.Y H:i:s',
        refreshFn: function(callbackFn, scope) {
            var store = this.getList().getStore();
            if (store) {
                store.load({
                    callback: function(records, operation, success) {
                        callbackFn.call(scope);
                    }
                });
            } else {
                callbackFn.call(scope);
            }
        },
        
		pullTpl: [
            '<div class="x-list-pullrefresh">',
                '<div class="x-list-pullrefresh-arrow"></div>',
                '<div class="x-loading-spinner">',
                    '<span class="x-loading-top"></span>',
                    '<span class="x-loading-right"></span>',
                    '<span class="x-loading-bottom"></span>',
                    '<span class="x-loading-left"></span>',
                '</div>',
                '<div class="x-list-pullrefresh-wrap">',
                    '<h3 class="x-list-pullrefresh-message">{message}</h3>',
                    '<div class="x-list-pullrefresh-updated">{lastUpdatedText}&nbsp;{lastUpdatedFormatted}</div>',
                '</div>',
            '</div>'
        ].join('')
	},
    
    initScrollable: function() {
        /* jshint maxcomplexity:10 */
        var me = this,
            list = me.getList(),
            store = list.getStore(),
            pullTpl = me.getPullTpl(),
            element = me.element,
            scrollable = list.getScrollable(),
            scroller;

        if (!scrollable) {
            return;
        }

        scroller = scrollable.getScroller();

        me.lastUpdated = new Date();
        me.lastUpdatedFormatted = Ext.util.Format.date(me.lastUpdated, me.getDateFormat());

        list.container.insert(0, me);

        // We provide our own load mask so if the Store is autoLoading already disable the List's mask straight away,
        // otherwise if the Store loads later allow the mask to show once then remove it thereafter
        if (store) {
            if (store.isAutoLoading()) {
                list.setLoadingText(null);
            } else {
                store.on({
                    load: {
                        single: true,
                        fn: function() {
                            list.setLoadingText(null);
                        }
                    }
                });
            }
        }

        pullTpl.overwrite(element, {
            message: me.getPullRefreshText(),
            lastUpdatedText: me.getLastUpdatedText(),
            lastUpdatedFormatted: me.lastUpdatedFormatted
        }, true);

        me.loadingElement = element.getFirstChild();
        me.messageEl = element.down('.x-list-pullrefresh-message');
        me.updatedEl = element.down('.x-list-pullrefresh-updated');

        me.maxScroller = scroller.getMaxPosition();

        scroller.on({
            maxpositionchange: me.setMaxScroller,
            scroll: me.onScrollChange,
            scope: me
        });
    },
    
    onBounceTop: function(y) {
        /* jshint maxcomplexity:10 */
        var me = this,
            pullHeight = me.pullHeight,
            list = me.getList(),
            scroller = list.getScrollable().getScroller();

        if (!me.isReleased && !me.isLoading) {
            if (!pullHeight) {
                me.onPainted();
                pullHeight = me.pullHeight;
            }
            if (!me.isRefreshing && -y >= pullHeight + 10) {
                me.isRefreshing = true;

                me.setViewState('release');

                scroller.getContainer().onBefore({
                    dragend: 'onScrollerDragEnd',
                    single: true,
                    scope: me
                });
            }
            else if (me.isRefreshing && -y < pullHeight + 10) {
                me.isRefreshing = false;
                me.setViewState('pull');
            }
        }
        
        me.getTranslatable().translate(0, -y);
    },
    
    loadStore: function() {
        var me = this,
            list = me.getList(),
            store = list.getStore();

        me.setViewState('loading');
        me.isReleased = false;
        me.isLoading = true;
        
        if (me.getRefreshFn()) {
            if(store) {
                store.suspendEvents();
            }
            me.getRefreshFn().call(me, me.afterStoreLoad, me);
        } else {
            me.fetchLatest();
            Ext.defer(function() {
                me.resetRefreshElement();
            }, 1000);
        }
    },
    
    afterStoreLoad: function() {
        var me = this,
            list = me.getList(),
            store = list.getStore();
        
        if(store) {
            store.resumeEvents();
        }
        me.resetRefreshElement();
    },
    
    resetRefreshElement: function() {
        var me = this,
            list = me.getList(),
            scroller = list.getScrollable().getScroller();

        me.isLoading = false;
        me.resetRefreshState();
        scroller.minPosition.y = 0;
        scroller.scrollTo(null, 0, true);
    },
	
    resetRefreshState: function() {
        var me = this;

        me.isRefreshing = false;
        me.lastUpdated = new Date();
        me.lastUpdatedFormatted = Ext.util.Format.date(me.lastUpdated, me.getDateFormat());

        me.setViewState('pull');
        me.updatedEl.setHtml(this.getLastUpdatedText() + '&nbsp;' +  me.lastUpdatedFormatted);
    }
});