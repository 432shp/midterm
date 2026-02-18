$(function () {
  // ページロード時にモーダルとオーバーレイを非表示に
  $('.remodal').hide();
  $('.remodal-overlay').remove();

  // モーダルを開く
  $(".btn").on('click', function (e) {
    e.preventDefault();
    const targetId = $(this).attr('href'); // 例: #modal_1
    const $modal = $(targetId);
// オーバーレイを作成してフェードイン（既存のオーバーレイは削除）
    $('<div class="remodal-overlay"></div>')	
    $('.remodal-overlay').remove();
    const $overlay = $('<div class="remodal-overlay"></div>').appendTo('body').fadeIn(200);

// モーダル表示
    $modal.fadeIn(200);
});

  // 閉じるボタンでモーダルを閉じる
  $(document).on('click', '.remodal-cancel', function () {
    closeModal();
  });

  // オーバーレイをクリックした場合も閉じる
  $(document).on('click', '.remodal-overlay', function () {
    closeModal();
  });

  // モーダルを閉じる関数
  function closeModal() {
    $('.remodal').fadeOut(200);
    $('.remodal-overlay').fadeOut(200, function () {
      $(this).remove();
    });
  }
});
