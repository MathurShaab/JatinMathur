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

// ---------- Element References ----------
const chatbotIcon = document.getElementById('chatbot-icon');
const chatbotBox = document.getElementById('chatbot-box');
const closeChatBtn = document.getElementById('closeChat');
const chatbotMessages = document.getElementById('chatbot-messages');
const userMessageInput = document.getElementById('userMessage');
const sendMessageBtn = document.getElementById('sendMessage');
const overlay = document.getElementById('chatbot-overlay');
const voiceBtn = document.getElementById('voiceBtn');

// ---------- Open/Close Chat Window ----------
chatbotIcon.addEventListener('click', () => {
    chatbotBox.classList.toggle('collapsed');
    overlay.classList.toggle('active');
});
closeChatBtn.addEventListener('click', () => {
    chatbotBox.classList.add('collapsed');
    overlay.classList.remove('active');
});
overlay.addEventListener('click', () => {
    chatbotBox.classList.add('collapsed');
    overlay.classList.remove('active');
});

// ---------- Send Message ----------
sendMessageBtn.addEventListener('click', sendMessage);
userMessageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = userMessageInput.value.trim();
    if (!message) return;

    appendMessage('user', message);
    userMessageInput.value = '';
    sendMessageToAPI(message);
}

// ---------- Append Message ----------
function appendMessage(sender, text) {
    const div = document.createElement('div');
    div.className = `chat-message ${sender}`;

    if (text.includes("```")) {
        const codeContent = text.replace(/```[a-z]*\n?([\s\S]*?)```/, "$1").trim();
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.textContent = codeContent;
        pre.appendChild(code);
        div.appendChild(pre);
    } else {
        const formattedLines = formatMessage(text).split('\n').map(line => {
            const lineDiv = document.createElement('div');
            lineDiv.innerHTML = line.trim();
            return lineDiv;
        });
        formattedLines.forEach(lineDiv => div.appendChild(lineDiv));
    }

    // If it's a bot message → add Copy button
    if (sender === 'bot') {
        addCopyButton(div, text);
    }

    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// ---------- Message Formatting ----------
function formatMessage(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    text = text.replace(/(^|[^*])\*(.*?)\*/g, "$1<i>$2</i>");
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
    text = text.replace(/^\s*\* (.*)$/gm, "• $1");
    return text;
}

// ---------- Copy Button ----------
function addCopyButton(messageElement, messageText) {
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "📋 Copy";
    copyBtn.classList.add("copy-btn");

    copyBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(messageText);
            copyBtn.textContent = "✅ Copied!";
            setTimeout(() => (copyBtn.textContent = "📋 Copy"), 1500);
        } catch (err) {
            console.error("Copy failed:", err);
            copyBtn.textContent = "❌ Error";
        }
    });

    messageElement.appendChild(copyBtn);
}

// ---------- Voice Recognition ----------
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-IN';
recognition.interimResults = false;

voiceBtn.addEventListener('click', () => {
    speechSynthesis.cancel(); // Stop current speech
    recognition.start();
    console.log('🎙️ Listening...');
});

recognition.onresult = (event) => {
    const voiceMessage = event.results[0][0].transcript;
    appendMessage('user', voiceMessage);
    sendMessageToAPI(voiceMessage);
};

recognition.onstart = () => {
    const listeningDiv = document.createElement('div');
    listeningDiv.id = 'listeningIndicator';
    listeningDiv.className = 'typing-indicator';
    listeningDiv.textContent = '🎧 Listening...';
    chatbotMessages.appendChild(listeningDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
};
recognition.onend = () => {
    const listeningDiv = document.getElementById('listeningIndicator');
    if (listeningDiv) chatbotMessages.removeChild(listeningDiv);
};

// ---------- Send Message to Gemini API ----------
async function sendMessageToAPI(message) {
    // Stop any old speech before new query
    speechSynthesis.cancel();

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    try {
        const res = await fetch('https://jatin-mathur.vercel.app/api/chat.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: message })
        });

        if (!res.ok) throw new Error('API error');

        const data = await res.json();
        chatbotMessages.removeChild(typingDiv);

        const botText = data.response || data.reply || "No response";
        appendMessage('bot', botText);
        speakResponse(botText);

    } catch (err) {
        chatbotMessages.removeChild(typingDiv);
        appendMessage('bot', '⚠️ Error: Unable to fetch response');
        console.error(err);
    }
}

// ---------- Text-to-Speech (Indian English) ----------
function speakResponse(text) {
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN'; // Indian English
    const voices = speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang === "en-IN" || v.name.includes("India"));
    if (indianVoice) utterance.voice = indianVoice;
    speechSynthesis.speak(utterance);
}






