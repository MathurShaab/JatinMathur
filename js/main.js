(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Navbar on scrolling
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.navbar').fadeIn('slow').css('display', 'flex');
        } else {
            $('.navbar').fadeOut('slow').css('display', 'none');
        }
    });


    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    

    // Typed Initiate
    if ($('.typed-text-output').length == 1) {
        var typed_strings = $('.typed-text').text();
        var typed = new Typed('.typed-text-output', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }


    // Modal Video
    var $videoSrc;
    $('.btn-play').click(function () {
        $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);
    $('#videoModal').on('shown.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    })
    $('#videoModal').on('hide.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc);
    })


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Skills
    $('.skill').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
    });

    
})(jQuery);
const chatbotIcon = document.getElementById('chatbot-icon');
const chatbotBox = document.getElementById('chatbot-box');
const closeChatBtn = document.getElementById('closeChat');
const chatbotMessages = document.getElementById('chatbot-messages');
const userMessageInput = document.getElementById('userMessage');
const sendMessageBtn = document.getElementById('sendMessage');
const overlay = document.getElementById('chatbot-overlay');

// Open/Close chat window
chatbotIcon.addEventListener('click', () => {
    chatbotBox.classList.toggle('collapsed');
    overlay.classList.toggle('active');
});

closeChatBtn.addEventListener('click', () => {
    chatbotBox.classList.add('collapsed');
    overlay.classList.remove('active');
});

// Close chat if overlay is clicked
overlay.addEventListener('click', () => {
    chatbotBox.classList.add('collapsed');
    overlay.classList.remove('active');
});

// Send message events
sendMessageBtn.addEventListener('click', sendMessage);
userMessageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = userMessageInput.value.trim();
    if (!message) return;

    appendMessage('user', message);
    userMessageInput.value = '';

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Call API
    fetch('https://jatin-mathur.vercel.app/api/chat.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message }),
    })
    .then(res => res.json())
    .then(data => {
        chatbotMessages.removeChild(typingDiv);
        appendMessage('bot', data.response);
    })
    .catch(() => {
        chatbotMessages.removeChild(typingDiv);
        appendMessage('bot', '⚠️ Error: Unable to fetch response');
    });
}

function appendMessage(sender, text) {
    const div = document.createElement('div');
    div.className = `chat-message ${sender}`;

    // Detect if response contains code block
    if (text.includes("```")) {
        const codeContent = text.replace(/```[a-z]*\n?([\s\S]*?)```/, "$1").trim();
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.textContent = codeContent;
        pre.appendChild(code);
        div.appendChild(pre);
    } else {
        // Apply formatting (bold, italic, inline code, lists)
        div.innerHTML = formatMessage(text);
    }

    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// ---- Format Message with Bold, Italic, Inline Code & Bullet Points ----
function formatMessage(text) {
    // Bold (**text**)
    text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // Italic (*text*) - only if not a list item
    text = text.replace(/(^|[^*])\*(.*?)\*/g, "$1<i>$2</i>");

    // Inline code (`text`)
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Bullet points (* item → • item)
    text = text.replace(/^\s*\* (.*)$/gm, "• $1");

    return text;
}




