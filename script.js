$(document).ready(function () {
  /* ===== NEWS MỞ/ĐÓNG ===== */
  $(".side").on("click", ".toggle-icon", function (e) {
    e.stopPropagation();
    const $news = $(this).closest(".news");
    $news.toggleClass("open");
    const content = $news.find("p");
    if ($news.hasClass("open")) content.stop(true, true).slideDown(200);
    else content.stop(true, true).slideUp(200);
  });

  /* ===== NEWS KÉO THẢ ===== */
  $(".side").sortable({
    items: ".news",
    cursor: "move",
    opacity: 0.9,
    tolerance: "pointer",
    handle: ".drag-handle",
    helper: "clone",
    placeholder: "news-placeholder",
    start: function (e, ui) {
      ui.placeholder.height(ui.item.height());
      ui.item.data("wasOpen", ui.item.hasClass("open"));
      ui.item.find("p").slideUp(150);
      ui.item.addClass("dragging");
    },
    stop: function (e, ui) {
      ui.item.removeClass("dragging");
      if (ui.item.data("wasOpen")) {
        ui.item.addClass("open");
        ui.item.find("p").slideDown(200);
      }
    }
  }).disableSelection();

  /* ===== NAV & FOOTER ===== */
  $("nav li, footer li").click(function () {
    const index = $(this).index();
    $("nav li, footer li").removeClass("active");
    $("nav li").eq(index).addClass("active");
    $("footer li").eq(index).addClass("active");
  });

  /* ===== POPUP CÀI ĐẶT ===== */
  const $settings = $("#process-settings");
  const $settingsBtn = $("#process-settings-btn");
  const $applyBtn = $("#apply-settings");
  const $cancelBtn = $("#cancel-settings");
  const $sampleText = $("#sample-test-text");

  $settingsBtn.on("click", function (e) {
    e.stopPropagation();
    if ($settings.is(":visible")) return closeSettings();

    const btnRect = this.getBoundingClientRect();
    $settings.css({
      top: btnRect.bottom + window.scrollY + 6 + "px",
      left: btnRect.left + window.scrollX + "px"
    }).fadeIn(120).attr("aria-hidden", "false");
    $settingsBtn.attr("aria-expanded", "true");
  });

  $("#close-settings").on("click", closeSettings);
  $(document).on("click.processSettings", function (e) {
    if ($settings.is(":visible") &&
        $(e.target).closest("#process-settings, #process-settings-btn").length === 0) {
      closeSettings();
    }
  });

  function closeSettings() {
    $settings.fadeOut(120).attr("aria-hidden", "true");
    $settingsBtn.attr("aria-expanded", "false");
  }

  /* ===== ÁP DỤNG CÀI ĐẶT (Apply) ===== */
  $applyBtn.on("click", function () {
    const bold = $("#opt-bold").is(":checked");
    const italic = $("#opt-italic").is(":checked");
    const underline = $("#opt-underline").is(":checked");
    const color = $("#text-color").val();    
    const bgcolor = $("#opt-bgcolor").val();

    $sampleText.removeClass("pt-bold pt-italic pt-underline").css({
      color: "",
      backgroundColor: ""
    });

    if (bold) $sampleText.addClass("pt-bold");
    if (italic) $sampleText.addClass("pt-italic");
    if (underline) $sampleText.addClass("pt-underline");
    if (color) $sampleText.css("color", color);
    if (bgcolor) $sampleText.css("background-color", bgcolor);

    closeSettings();
  });

  $cancelBtn.on("click", closeSettings);

  /* ===== LƯU NỘI DUNG GỐC ===== */
  const $textArea = $(".text-area p");
  let originalText = $textArea.html();

  /* ===== HIGHLIGHT ===== */
  $(".tools button:contains('Highlight')").on("click", function () {
    const pattern = $("#pattern").val().trim();
    if (!pattern) return alert("Vui lòng nhập chuỗi cần highlight!");

    const bold = $("#opt-bold").is(":checked");
    const italic = $("#opt-italic").is(":checked");
    const underline = $("#opt-underline").is(":checked");
    const bgcolor = $("#opt-bgcolor").val();
    const color = $("#text-color").val();

    let cls = "highlight";
    if (bold) cls += " pt-bold";
    if (italic) cls += " pt-italic";
    if (underline) cls += " pt-underline";

    $textArea.html(originalText);
    const regex = new RegExp(`(${escapeRegExp(pattern)})`, "gi");
    const newHtml = $textArea.html().replace(regex, `<span class="${cls}">$1</span>`);
    $textArea.html(newHtml);

    if (bgcolor) $(".highlight").css("background-color", bgcolor);
    if (color) $(".highlight").css("color", color);
    else if (bgcolor) $(".highlight").css("color", isColorDark(bgcolor) ? "#fff" : "#000");
    else $(".highlight").css("color", "");
  });

  /* ===== DELETE HIGHLIGHT ===== */
  $(".tools button:contains('Delete')").on("click", function () {
    $textArea.find(".highlight").each(function () {
      $(this).replaceWith($(this).text());
    });
  });

  /* ===== RESET ===== */
  $(".tools button:contains('Reset')").on("click", function () {
    $textArea.html(originalText);
  });

  /* ===== HÀM HỖ TRỢ ===== */
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function isColorDark(hex) {
    const c = hex.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 128;
  }

  /* ===== GRID ĐỘNG (VẬT NUÔI) ===== */
  $(".animal-grid").sortable({ placeholder: "animal-placeholder", tolerance: "pointer" });

  $(".selected-animal").click(function () { $(".animal-options").slideToggle(150); });
  $(".animal-options div").click(function () {
    const img = $(this).data("img");
    const name = $(this).data("name");
    $(".selected-animal img").attr("src", img);
    $(".selected-animal span:first").text(name);
    $(".animal-options").slideUp(150);
  });
  $(".add-btn").click(function () {
    const img = $(".selected-animal img").attr("src");
    const name = $(".selected-animal span:first").text();
    $(".animal-grid").append(`
      <div class="animal-item">
        <img src="${img}" alt="${name}">
        <p>${name}</p>
      </div>
    `);
  });
});
