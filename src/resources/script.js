const MAIN_ADT_SERVER_ADDRESS = "193.164.18.155:1212";
const STATUS_ELEMENTS = {};
const FETCH_STATUS_INTERVAL = 1000;
const FETCH_STATUS_ERROR_INTERVAL = 5000;

function init() {
    GetStatusElements();
    MainADTServerStatus();
    CopyADTLinkEvent();

    document.querySelectorAll(".arc-slider").forEach((sliderElement) => {
        initArcSlider(sliderElement);
    });
}

if (document.readyState === 'loading') {
    // Документ ещё загружается
    document.addEventListener('DOMContentLoaded', init);
} else {
    // Документ уже загружен
    init();
}

/**
 * Initializes an arc-slider component, binding navigation, arrows, and info label behavior
 * @param {HTMLElement} sliderElement - Root element with class "arc-slider"
 * @returns {void}
 */
function initArcSlider(sliderElement) {
    if (!sliderElement) return;

    const ACTIVE_SLIDE_CLASS = "arc-slider__slide--active";
    const ACTIVE_NAV_CLASS = "arc-slider__nav-btn--active";

    const slides = Array.from(sliderElement.querySelectorAll(".arc-slider__slide"));
    const slideImages = Array.from(sliderElement.querySelectorAll(".arc-slider__slide span > a > img"));
    const navButtons = Array.from(sliderElement.querySelectorAll(".arc-slider__nav-btn"));
    const arrowBack = sliderElement.querySelector(".arc-slider__arrow--back");
    const arrowNext = sliderElement.querySelector(".arc-slider__arrow--next");
    const infoElement = sliderElement.querySelector(".arc-slider__info");

    if (slides.length === 0) {
        console.warn("Arc slider " + sliderElement + ": no slides found");
        return;
    }

    const defaultInfoText = infoElement ? infoElement.innerText : "";
    let currentIndex = slides.findIndex(slide => slide.classList.contains(ACTIVE_SLIDE_CLASS));
    if (currentIndex === -1) currentIndex = 0;

    updateInfoForCurrentSlide();

    function setInfoText(text) {
        if (!infoElement) return;
        infoElement.innerText = (text != null) ? text : defaultInfoText;
    }

    function updateInfoForCurrentSlide() {
        let infoText = null;
        try {
            infoText = navButtons[currentIndex].querySelector("img").alt || null;
        } catch (error) {
            console.warn("Error updating info text:", error);
        }
        setInfoText(infoText);
    }

    function goToSlide(index) {
        if (index === currentIndex) return;

        slides[currentIndex].classList.remove(ACTIVE_SLIDE_CLASS);
        slides[index].classList.add(ACTIVE_SLIDE_CLASS);

        if (navButtons.length > 0) {
            navButtons[currentIndex].classList.remove(ACTIVE_NAV_CLASS);
            navButtons[index].classList.add(ACTIVE_NAV_CLASS);
        }

        currentIndex = index;
        updateInfoForCurrentSlide();
    }

    // Nav button click handlers
    navButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => goToSlide(index));

        let altText = btn.querySelector("img")?.alt;
        if (altText) {
            btn.addEventListener("mouseover", () => setInfoText(altText));
            btn.addEventListener("mouseout", () => updateInfoForCurrentSlide());
        }
    });

    // Slide image hover handlers
    slideImages.forEach(img => {
        if (img.alt) {
            img.addEventListener("mouseover", () => setInfoText(img.alt));
            img.addEventListener("mouseout", () => updateInfoForCurrentSlide());
        }
    });

    // Arrow handlers
    arrowBack.addEventListener("click", () => goToSlide((currentIndex - 1 + slides.length) % slides.length));
    arrowNext.addEventListener("click", () => goToSlide((currentIndex + 1) % slides.length));
}

/**
 * Adds click event listener to ADT link for copying server address
 * @returns {void}
 */
function CopyADTLinkEvent() {
    const linkADT = document.getElementById("ss14-adt-link");
    if (!linkADT) {
        console.warn("ADT link element not found");
        return;
    }
    
    const text_linkADT = linkADT.textContent;
    linkADT.addEventListener("click", () => CopyOnClick(text_linkADT));
}

/**
 * Initializes global status elements by retrieving DOM elements and storing them in STATUS_ELEMENTS
 * @returns {void}
 */
function GetStatusElements()
{
    STATUS_ELEMENTS.root = document.getElementById("server-status");
    
    if (!STATUS_ELEMENTS.root) {
        console.warn("Server status root element not found");
        return;
    }
    
    STATUS_ELEMENTS.indicator = STATUS_ELEMENTS.root.querySelector("#indicator");
    STATUS_ELEMENTS.indicator_text = STATUS_ELEMENTS.root.querySelector("#indicator-text");
    STATUS_ELEMENTS.player_count = STATUS_ELEMENTS.root.querySelector("#player-count");
    STATUS_ELEMENTS.bunker_status = STATUS_ELEMENTS.root.querySelector("#server-status i.fa-shield-halved");
    STATUS_ELEMENTS.bunker_status_text = STATUS_ELEMENTS.root.querySelector("#server-status i.fa-shield-halved + span");
    STATUS_ELEMENTS.current_map = STATUS_ELEMENTS.root.querySelector("#current-map");
    STATUS_ELEMENTS.round_duration = STATUS_ELEMENTS.root.querySelector("#round-duration");
    STATUS_ELEMENTS.preset = STATUS_ELEMENTS.root.querySelector("#preset");
}

/**
 * Initiates server monitoring by fetching status from the main ADT server
 * @returns {Promise<void>}
 */
async function MainADTServerStatus() {
    if (!STATUS_ELEMENTS.root) {
        console.warn("Status elements not initialized, skipping status check");
        return;
    }

    let response;

    try {
        response = await fetch("http://" + MAIN_ADT_SERVER_ADDRESS + "/status");
    }
    catch (error) {
        console.error("Error during fetching information from " + MAIN_ADT_SERVER_ADDRESS + " - " + error);
        OffStatusChange(0);
    }

    if (response.ok) {
        let content = await response.json();
        OkStatusChange(content);
    }
    else {
        OffStatusChange(response.status);
    }
}

/**
 * Updates UI elements to reflect online server status and schedules next status check
 * @param {Object} content - JSON response from server status endpoint
 * @param {boolean} content.panic_bunker - Bunker activation status
 * @param {number} content.soft_max_players - Maximum allowed players
 * @param {number} content.players - Current player count
 * @param {string} content.map - Current map name
 * @param {string} content.preset - Current game preset
 * @param {string} content.round_start_time - ISO timestamp of round start
 * @returns {void}
 */
function OkStatusChange(content) {
    let isBunker = content.panic_bunker;
    let maxPlayers = content.soft_max_players;
    let currentPlayers = content.players;
    let map = content.map;
    let preset = content.preset;
    let roundStartTime = content.round_start_time;
    let { hours, minutes, seconds } = GetDuration(roundStartTime);

    STATUS_ELEMENTS.indicator.style.color = "#52c357";
    STATUS_ELEMENTS.indicator_text.innerText = "Онлайн";
    STATUS_ELEMENTS.player_count.innerText = `${currentPlayers}/${maxPlayers}`;
    STATUS_ELEMENTS.current_map.innerText = map ? map : "Карта не выбрана";
    STATUS_ELEMENTS.preset.innerText = preset ? preset : "Режим не выбран";
    STATUS_ELEMENTS.round_duration.innerText = (seconds != -1) ? `${hours}:${minutes}:${seconds}` : "Лобби";
    STATUS_ELEMENTS.player_count.style.color = (currentPlayers >= maxPlayers) ? "#f7baba" : "inherit";
    STATUS_ELEMENTS.bunker_status.style.color = isBunker ? "#ff3c3c" : "#ffffff4d";
    STATUS_ELEMENTS.bunker_status_text.innerText = isBunker ? "Бункер активен" : "Бункер неактивен";

    setTimeout(MainADTServerStatus, FETCH_STATUS_INTERVAL);

    function GetDuration(startTime) {
        if (startTime == undefined)
            return {seconds: -1};

        let startTimeDate = new Date(startTime);
        let currentTime = new Date();
        let duration = Math.floor((currentTime - startTimeDate) / 1000);

        let minutes = Math.floor(duration / 60);
        let hours = Math.floor(duration / (60 * 60));
        let seconds = duration % 60;

        if (minutes >= 60) { minutes = minutes % 60; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (hours < 10) { hours = "0" + hours; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return { hours, minutes, seconds };
    }
}

/**
 * Updates UI elements to reflect offline server status and schedules next status check
 * @param {number} status - HTTP status code (0 if server unreachable)
 * @returns {void}
 */
function OffStatusChange(status) {
    if (status == 0) {
        STATUS_ELEMENTS.indicator.style.color = "gray";
        STATUS_ELEMENTS.indicator_text.innerText = "Недоступно";
    } else {
        STATUS_ELEMENTS.indicator.style.color = "#ff3c3c";
        STATUS_ELEMENTS.indicator_text.innerText = "Оффлайн";
    }
    setTimeout(MainADTServerStatus, FETCH_STATUS_ERROR_INTERVAL);
}

/**
 * Copies provided text to clipboard and shows alert
 * @param {string} objectText - Text to copy to clipboard
 * @returns {void}
 * @throws {Error} If clipboard API is not available or copy fails
 */
const CopyOnClick = function(objectText) {
    try {
        navigator.clipboard.writeText(objectText);
        alert("Адрес скопирован в буфер обмена!");
    } catch (error) {
        alert("Неизвестная ошибка при копировании" + error);
    }
}