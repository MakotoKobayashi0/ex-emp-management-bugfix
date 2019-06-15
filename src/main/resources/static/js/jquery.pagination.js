/* =============================================================================
	Pagination ver1.0.5
	Copyright(c) 2015, ShanaBrian
	Dual licensed under the MIT and GPL licenses.
============================================================================= */
(function($) {
	$.fn.pagination = function(options) {
		if ($(this).length === 0) return this;

		if ($(this).length > 1) {
			var these = [];
			$.each(this, function() {
				these.push($(this).pagination(options));
			});
			return $(these);
		}

		var $element           = this,
			$items             = null,
			$paginationItems   = null,
			$prevPageBtnBox    = null,
			$nextPageBtnBox    = null,
			$firstPageBtnBox   = null,
			$endPageBtnBox     = null,
			$firstPageEllipsis = null,
			$endPageEllipsis   = null,
			$pageInfo          = null,
			settings           = {},
			status             = {};

		// 初期化
		var init = function() {
			/*
				paginationMode                 : ページ切り替え機能の有無（デフォルトはオンでオフで初期定義されている機能を使う）
				itemElement                    : アイテムの要素
				defaultDisplayPageNumber       : 初期表示するページ番号
				displayItemCount               : 1ページ毎に表示する個数
				prevNextPageBtnMode            : 前・次のページへ移動するボタン機能の有無
				firstEndPageBtnMode            : 最初・最後のページへ移動するボタン機能の有無
				bothEndsBtnHideDisplay         : 先端または終端時に前へ・次へボタンを非表示にするかどうか
				pageLinkMode                   : ページ番号のリンク要素を追加するかどうか
				pageNumberLinkPrefix           : ページ番号のhrefのプレフィックス
				pageNumberDisplayNumber        : ページ番号の表示個数
				onePageOnlyDisplay             : 1ページのみの場合にページネーションを表示するかどうか
				onePageOnlyPrevNextPageDisplay : 1ページのみの場合に前・次のページへ移動するボタンを表示するかどうか
				onePageOnlyFirstEndPageDisplay : 1ページのみの場合に最初・最後のページへ移動するボタンを表示するかどうか
				pageInfoDisplay                : ページ情報の表示の有無
				pageInfoFormat                 : ページ情報の表示する文字列の書式
				ellipsisMode                   : 省略記号を表示するかどうか
				ellipsisText                   : 省略記号
				ellipsisMaxPageNumber          : 省略記号が表示される最大ページ数
				clickUserFunction              : クリックのユーザー定義関数（この機能を使うとページ切り替えが行われない）
				wrapElement                    : 親要素を包む要素
				prevBtnText                    : 前のページへ移動するボタンの文字列（要素指定可能）
				nextBtnText                    : 次のページへ移動するボタンの文字列（要素指定可能）
				firstPageBtnText               : 最初のページへ移動するボタンの文字列（要素指定可能）
				endPageBtnText                 : 最後のページへ移動するボタンの文字列（要素指定可能）
				paginationClassName            : ページネーション本体のクラス名
				paginationInnerClassName       : ページネーション本体の内側のクラス名
				pageNumberClassName            : ページ番号のクラス名
				currentPageNumberClassName     : カレントページ番号のクラス名
				prevBtnClassName               : 前のページへ移動するボタンのクラス名
				nextBtnClassName               : 次のページへ移動するボタンのクラス名
				firstBtnClassName              : 最初のページへ移動するボタンのクラス名
				endBtnClassName                : 最後のページへ移動するボタンのクラス名
				prevNextBtnDisabledClassName   : 前・次のページへ移動するボタンの機能無効時のクラス名
				ellipsisClassName              : 省略記号のクラス名
				pageInfoClassName              : ページ番号表示のクラス名
				setPagination                  : ページネーションを設置する箇所
				setPaginationMode              : ページネーションを設置する方法
				changeStartCallback            : 切り替え開始時のコールバック関数
				changeEndCallback              : 切り替え終了時のコールバック関数
			*/
			settings = $.extend({
				paginationMode                 : true,
				itemElement                    : null,
				defaultDisplayPageNumber       : 1,
				displayItemCount               : 10,
				prevNextPageBtnMode            : true,
				firstEndPageBtnMode            : false,
				bothEndsBtnHideDisplay         : true,
				pageLinkMode                   : true,
				pageNumberLinkPrefix           : '#page-',
				pageNumberDisplayNumber        : 0,
				onePageOnlyDisplay             : true,
				onePageOnlyPrevNextPageDisplay : false,
				onePageOnlyFirstEndPageDisplay : false,
				pageInfoDisplay                : false,
				pageInfoFormat                 : 'Page %n / %m',
				ellipsisMode                   : false,
				ellipsisText                   : '...',
				ellipsisMaxPageNumber          : 20,
				clickUserFunction              : null,
				wrapElement                    : 'div',
				prevBtnText                    : '&lt;',
				nextBtnText                    : '&gt;',
				firstPageBtnText               : '&lt;&lt;',
				endPageBtnText                 : '&gt;&gt;',
				prevBtnAriaLabel               : 'Previous',
				nextBtnAriaLabel               : 'Next',
				firstPageBtnAriaLabel          : 'First Page',
				endPageBtnAriaLabel            : 'End Page',
				paginationClassName            : '',
				paginationInnerClassName       : '',
				pageNumberClassName            : '',
				currentPageNumberClassName     : 'current',
				prevBtnClassName               : 'prev-page',
				nextBtnClassName               : 'next-page',
				firstBtnClassName              : 'first-page',
				endBtnClassName                : 'end-page',
				prevNextBtnDisabledClassName   : 'disabled',
				ellipsisClassName              : 'ellipsis',
				pageInfoClassName              : 'page-info',
				setPagination                  : '',
				setPaginationMode              : 'after',
				changeStartCallback            : function() {},
				changeEndCallback              : function() {},
				idPrefix                       : 'pg'
			}, options);

			$items = $element.find(settings.itemElement);

			if ($items.length === 0) return;
			if (!settings.onePageOnlyDisplay && $items.length <= settings.displayItemCount) return;

			status = {
				id               : settings.idPrefix + new Date().getTime() + '_' + Math.floor(Math.random() * 10000),
				status           : 'wait',
				activePageNumber : 0,
				maxPageNumber    : 0,
				startPageNumber  : 0,
				historyPage      : []
			};

			setup();
		};

		// セットアップ
		var setup = function() {
			status.activePageNumber = settings.defaultDisplayPageNumber;
			status.maxPageNumber    = Math.ceil($items.length / settings.displayItemCount);
			status.startPageNumber  = settings.defaultDisplayPageNumber;

			if (settings.defaultDisplayPageNumber > status.maxPageNumber) {
				status.startPageNumber = status.maxPageNumber;
			}

			changeStatus();
			createNavigation();
			movePage();
			changePaginationPosition();
			changeEllipsis();
		};

		// ナビゲーションの生成
		var createNavigation = function() {
			var $paginationWrap         = $('<' + settings.wrapElement + '>'),
				$paginationBox          = $('<ul>'),
				$paginationItem         = $('<li>'),
				$paginationItemAnchor   = $('<a>'),
				$paginationItemC        = null,
				$paginationItemAnchorC  = null,
				$prevPageBtn            = null,
				$nextPageBtn            = null,
				$firstPageBtn           = null,
				$endPageBtn             = null,
				$firstPageEllipsisInner = null,
				$endPageEllipsisInner   = null,
				i                       = 0;

			$paginationBox.attr('role', 'menubar');

			$paginationWrap.addClass(settings.paginationClassName);
			$paginationBox.addClass(settings.paginationInnerClassName);

			for (i = 1; i <= status.maxPageNumber; i++) {
				$paginationItemC = $paginationItem.clone();

				if (settings.pageLinkMode) {
					$paginationItemAnchorC = $paginationItemAnchor.clone();
					$paginationItemAnchorC.text(i).attr('href', settings.pageNumberLinkPrefix + i);
					$paginationItemC.append($paginationItemAnchorC);
				} else {
					$paginationItemC.text(i);
				}
				$paginationItemC.attr('value', i).data('page-number', i);
				$paginationBox.append($paginationItemC);
			}
			
			if (settings.prevNextPageBtnMode) {
				$prevPageBtnBox = $('<li>');
				$nextPageBtnBox = $('<li>');
				$prevPageBtn    = $('<a>');
				$nextPageBtn    = $('<a>');

				$prevPageBtnBox.html(settings.prevBtnText);
				$nextPageBtnBox.html(settings.nextBtnText);
				$prevPageBtnBox.attr(settings.prevBtnAriaLabel);
				$nextPageBtnBox.attr(settings.nextBtnAriaLabel);
				$prevPageBtnBox.addClass(settings.prevBtnClassName);
				$nextPageBtnBox.addClass(settings.nextBtnClassName);

				$prevPageBtnBox.html($prevPageBtn.html($prevPageBtnBox.html()));
				$nextPageBtnBox.html($nextPageBtn.html($nextPageBtnBox.html()));
				
				$paginationBox.prepend($prevPageBtnBox).append($nextPageBtnBox);
			}

			$paginationWrap.append($paginationBox);

			$paginationItems = $paginationWrap.find('li');

			// 前・次のページへ移動するボタン
//			if (settings.prevNextPageBtnMode) {
//				$prevPageBtnBox = $('<span>');
//				$nextPageBtnBox = $('<span>');
//				$prevPageBtn    = $('<button>');
//				$nextPageBtn    = $('<button>');
//
//				$prevPageBtnBox.html(settings.prevBtnText);
//				$nextPageBtnBox.html(settings.nextBtnText);
//				$prevPageBtnBox.attr(settings.prevBtnAriaLabel);
//				$nextPageBtnBox.attr(settings.nextBtnAriaLabel);
//				$prevPageBtnBox.addClass(settings.prevBtnClassName);
//				$nextPageBtnBox.addClass(settings.nextBtnClassName);
//
//					$prevPageBtnBox.html($prevPageBtn.html($prevPageBtnBox.html()));
//					$nextPageBtnBox.html($nextPageBtn.html($nextPageBtnBox.html()));
//
//				$paginationWrap.prepend($prevPageBtnBox).append($nextPageBtnBox);
//			}

			// 最初・最後のページへ移動するボタン
			if (settings.firstEndPageBtnMode) {
				$firstPageBtnBox   = $('<p>');
				$endPageBtnBox     = $('<p>');
				$firstPageBtn      = $('<button>');
				$endPageBtnBoxLink = $('<button>');

				$firstPageBtnBox.html(settings.firstPageBtnText);
				$endPageBtnBox.html(settings.endPageBtnText);
				$firstPageBtnBox.addClass(settings.firstBtnClassName);
				$endPageBtnBox.addClass(settings.endBtnClassName);

				if (settings.pageLinkMode) {
					$firstPageBtn.attr('href', settings.pageNumberLinkPrefix + 1);
					$endPageBtnBoxLink.attr('href', settings.pageNumberLinkPrefix + status.maxPageNumber);
					$firstPageBtnBox.html($firstPageBtn.html($firstPageBtnBox.html()));
					$endPageBtnBox.html($endPageBtnBoxLink.html($endPageBtnBox.html()));
				}

				$paginationWrap.prepend($firstPageBtnBox).append($endPageBtnBox);
			}

			// 省略記号
			if (settings.ellipsisMode && settings.ellipsisMaxPageNumber <= status.maxPageNumber) {
				$firstPageEllipsis      = $paginationItem.clone();
				$endPageEllipsis        = $paginationItem.clone();
				$firstPageEllipsisInner = $('<span>');
				$endPageEllipsisInner   = $('<span>');

				$firstPageEllipsis.addClass(settings.ellipsisClassName);
				$endPageEllipsis.addClass(settings.ellipsisClassName);

				$firstPageEllipsisInner.html(settings.ellipsisText);
				$endPageEllipsisInner.html(settings.ellipsisText);

				$firstPageEllipsis.append($firstPageEllipsisInner);
				$endPageEllipsis.append($endPageEllipsisInner);

				$paginationItems.first().after($firstPageEllipsis);
				$paginationItems.last().before($endPageEllipsis);
			}

			if (settings.setPaginationMode) {
				if (settings.setPaginationMode === 'after') {
					$element.after($paginationWrap);
				} else if (settings.setPaginationMode === 'before') {
					$element.before($paginationWrap);
				} else if (settings.setPaginationMode === 'append') {
					$element.append($paginationWrap);
				} else if (settings.setPaginationMode === 'prepend') {
					$element.prepend($paginationWrap);
				}
			}

			// ページ番号
			if (settings.pageInfoDisplay) {
				$pageInfo = $('<p>');

				$pageInfo.addClass(settings.pageInfoClassName);

				$paginationWrap.append($pageInfo);

				setPageInfo();
			}

			addEvent();
		};

		// イベント追加
		var addEvent = function() {
			$paginationItems.on('click', function() {
				if (!$(this).data('page-number') || Number($(this).data('page-number')) === status.activePageNumber) return false;
				$element.movePage($(this).data('page-number'), settings.changeEndCallback, settings.changeStartCallback);
				return false;
			});

			if (settings.prevNextPageBtnMode) {
				$prevPageBtnBox.on('click', function() {
					$element.movePrevPage(settings.changeEndCallback, settings.changeStartCallback);
					return false;
				});

				$nextPageBtnBox.on('click', function() {
					$element.moveNextPage(settings.changeEndCallback, settings.changeStartCallback);
					return false;
				});
			}

			if (settings.firstEndPageBtnMode) {
				$firstPageBtnBox.on('click', function() {
					$element.moveFirstPage(settings.changeEndCallback, settings.changeStartCallback);
					return false;
				});

				$endPageBtnBox.on('click', function() {
					$element.moveEndPage(settings.changeEndCallback, settings.changeStartCallback);
					return false;
				});
			}
		};

		// 配列内の値の存在確認
		var inArray = function(searchValue, arrayData) {
			var key, result = -1;
			if ((searchValue || searchValue === 0) && arrayData) {
				if ((typeof searchValue === 'string' || typeof searchValue === 'number') && typeof arrayData === 'object') {
					for (key in arrayData) {
						if (arrayData[key] === searchValue) {
							result = key;
							break;
						}
					}
				}
			}
			return result;
		};

		// 表示するアイテムの範囲を取得（戻り値：インデックス番号）
		var getDisplayItemRange = function() {
			var results = [];
			$.each($items, function(itemIndex) {
				var itemPageNumber = Math.ceil((itemIndex + 1) / settings.displayItemCount);
				if (itemPageNumber === status.activePageNumber) {
					results.push(itemIndex);
				}
			});
			return results;
		};

		// 前のページの番号を取得
		var getPrevPageNumber = function() {
			var result = -1;
			if (status.activePageNumber > 1) {
				result = status.activePageNumber - 1;
			}
			return result;
		};

		// 次のページの番号を取得
		var getNextPageNumber = function() {
			var result = -1;
			if (status.activePageNumber < status.maxPageNumber) {
				result = status.activePageNumber + 1;
			}
			return result;
		};

		// 最初のページの番号を取得
		var getFirstPageNumber = function() {
			return 1;
		};

		// 最後のページの番号を取得
		var getEndPageNumber = function() {
			return status.maxPageNumber;
		};

		// ページ番号を設定
		var setPageNumber = function(pageNumber) {
			var result = false;
			if (pageNumber && String(pageNumber).match(/^[0-9]+$/)) {
				status.historyPage.push(status.activePageNumber);
				status.activePageNumber = Number(pageNumber);
				result = true;
			}
			return result;
		};

		// ページの移動
		var movePage = function(callback, startCallback) {
			var targetIndexs = getDisplayItemRange();

			if (startCallback && typeof startCallback === 'function') {
				startCallback.apply($element, [status]);
			}

			$.each($items, function(itemIndex) {
				if (inArray(itemIndex, targetIndexs) !== -1) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});

			changeStatus();
			changeClassName();
			changeAriaAttr();

			if (callback && typeof callback === 'function') {
				callback.apply($element, [status]);
			}

			return $element;
		};

		// ページネーションの表示範囲を取得
		var getViewPaginationPosition = function() {
			var result    = false,
				half      = 0,
				startPage = 0,
				endPage   = 0;

			if (settings.pageNumberDisplayNumber === 0) return false;
			if (settings.pageNumberDisplayNumber >= status.maxPageNumber) return false;

			half = Math.ceil(settings.pageNumberDisplayNumber / 2);

			if (status.activePageNumber <= half) {
				startPage = 1;
			} else {
				startPage = status.activePageNumber - half + 1;
			}

			endPage = startPage + settings.pageNumberDisplayNumber - 1;

			if (endPage > status.maxPageNumber) {
				startPage = status.maxPageNumber - settings.pageNumberDisplayNumber + 1;
				endPage   = status.maxPageNumber;
			}

			result = {
				startPage : startPage,
				endPage   : endPage
			};

			return result;
		};

		// ページネーションの表示範囲を変更
		var changePaginationPosition = function() {
			var position = getViewPaginationPosition();

			if (!position) return;

			$.each($paginationItems, function(index) {
				var thisPage = $(this).data('page-number');
				if (thisPage >= position.startPage && thisPage <= position.endPage) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});
		};

		// ページ番号の設定
		var setPageInfo = function() {
			var setText = settings.pageInfoFormat;

			if (!settings.pageInfoDisplay) return;

			setText = setText.replace('%n', status.activePageNumber);
			setText = setText.replace('%m', status.maxPageNumber);
			$pageInfo.html(setText);
		};

		// 省略記号の切り替え
		var changeEllipsis = function() {
			if (!settings.ellipsisMode || settings.ellipsisMaxPageNumber > status.maxPageNumber) return;

			var position = getViewPaginationPosition();

			if (!position) return;

			if (position.startPage > 1) {
				$.each($paginationItems, function(index) {
					if ($(this).data('page-number') == 1) {
						$(this).show();
						return false;
					}
				});
				$firstPageEllipsis.show();
			} else {
				$firstPageEllipsis.hide();
			}

			if (position.endPage < status.maxPageNumber) {
				$.each($paginationItems, function(index) {
					if ($(this).data('page-number') == status.maxPageNumber) {
						$(this).show();
						return false;
					}
				});
				$endPageEllipsis.show();
			} else {
				$endPageEllipsis.hide();
			}
		};

		// クラス名の切り替え
		var changeClassName = function() {
			var targetIndex = status.activePageNumber - 1;

			$paginationItems.eq(targetIndex).addClass(settings.currentPageNumberClassName);
			$paginationItems.eq(targetIndex).siblings().removeClass(settings.currentPageNumberClassName);

			if (status.activePageNumber === 1) {
				if (settings.prevNextPageBtnMode) {
					$prevPageBtnBox.addClass(settings.prevNextBtnDisabledClassName);
					$nextPageBtnBox.removeClass(settings.prevNextBtnDisabledClassName);
				}
				if (settings.firstEndPageBtnMode) {
					$firstPageBtnBox.addClass(settings.prevNextBtnDisabledClassName);
					$endPageBtnBox.removeClass(settings.prevNextBtnDisabledClassName);
				}
			} else if (status.activePageNumber === status.maxPageNumber) {
				if (settings.prevNextPageBtnMode) {
					$prevPageBtnBox.removeClass(settings.prevNextBtnDisabledClassName);
					$nextPageBtnBox.addClass(settings.prevNextBtnDisabledClassName);
				}
				if (settings.firstEndPageBtnMode) {
					$firstPageBtnBox.removeClass(settings.prevNextBtnDisabledClassName);
					$endPageBtnBox.addClass(settings.prevNextBtnDisabledClassName);
				}
			} else {
				if (settings.prevNextPageBtnMode) {
					$prevPageBtnBox.removeClass(settings.prevNextBtnDisabledClassName);
					$nextPageBtnBox.removeClass(settings.prevNextBtnDisabledClassName);
				}
				if (settings.firstEndPageBtnMode) {
					$firstPageBtnBox.removeClass(settings.prevNextBtnDisabledClassName);
					$endPageBtnBox.removeClass(settings.prevNextBtnDisabledClassName);
				}
			}
		};

		// ARIA属性切り替え
		var changeAriaAttr = function() {
			var targetIndex = status.activePageNumber - 1;

			$paginationItems.eq(targetIndex).attr('aria-selected', 'true');
			$paginationItems.eq(targetIndex).siblings().not('.' + settings.ellipsisClassName).attr('aria-selected', 'false');
		};

		// ステータスの切り替え
		var changeStatus = function() {
			if (status.activePageNumber === 1) {
				status.status = 'start';
			} else if (status.activePageNumber === status.maxPageNumber) {
				status.status = 'end';
			} else {
				status.status = 'middle';
			}
		};

		// ステータスの取得（メソッド）
		$element.getStatus = function() {
			return status;
		};

		// 前のページへ移動（メソッド）
		$element.movePrevPage = function(callback, startCallback) {
			var pageNumber = getPrevPageNumber();

			if (!callback || callback && typeof callback !== 'function') {
				callback = function() {};
			}

			if (!startCallback || startCallback && typeof startCallback !== 'function') {
				startCallback = function() {};
			}

			if (pageNumber !== -1 && pageNumber !== status.activePageNumber) {
				setPageNumber(pageNumber);
				movePage(callback, startCallback);
				changePaginationPosition();
				changeEllipsis();
				setPageInfo();
			}

			return $element;
		};

		// 次のページへ移動（メソッド）
		$element.moveNextPage = function(callback, startCallback) {
			var pageNumber = getNextPageNumber();

			if (!callback || callback && typeof callback !== 'function') {
				callback = function() {};
			}

			if (!startCallback || startCallback && typeof startCallback !== 'function') {
				startCallback = function() {};
			}

			if (pageNumber !== -1 && pageNumber !== status.activePageNumber) {
				setPageNumber(pageNumber);
				movePage(callback, startCallback);
				changePaginationPosition();
				changeEllipsis();
				setPageInfo();
			}

			return $element;
		};

		// 最初のページへ移動（メソッド）
		$element.moveFirstPage = function(callback, startCallback) {
			var pageNumber = getFirstPageNumber();

			if (!callback || callback && typeof callback !== 'function') {
				callback = function() {};
			}

			if (!startCallback || startCallback && typeof startCallback !== 'function') {
				startCallback = function() {};
			}

			if (pageNumber !== -1 && pageNumber !== status.activePageNumber) {
				setPageNumber(pageNumber);
				movePage(callback, startCallback);
				changePaginationPosition();
				changeEllipsis();
				setPageInfo();
			}

			return $element;
		};

		// 最後のページへ移動（メソッド）
		$element.moveEndPage = function(callback, startCallback) {
			var pageNumber = getEndPageNumber();

			if (!callback || callback && typeof callback !== 'function') {
				callback = function() {};
			}

			if (!startCallback || startCallback && typeof startCallback !== 'function') {
				startCallback = function() {};
			}

			if (pageNumber !== -1 && pageNumber !== status.activePageNumber) {
				setPageNumber(pageNumber);
				movePage(callback, startCallback);
				changePaginationPosition();
				changeEllipsis();
				setPageInfo();
			}

			return $element;
		};

		// ページの移動（メソッド）
		$element.movePage = function(pageNumber, callback, startCallback) {
			if ((pageNumber || pageNumber === 0) && String(pageNumber).match(/^[0-9]+$/)) {

				if (!callback || callback && typeof callback !== 'function') {
					callback = function() {};
				}

				if (!startCallback || startCallback && typeof startCallback !== 'function') {
					startCallback = function() {};
				}

				setPageNumber(pageNumber);
				movePage(callback, startCallback);
				changePaginationPosition();
				changeEllipsis();
				setPageInfo();
			}

			return $element;
		};

		init();

		return this;
	};
})(jQuery);