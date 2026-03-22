document.querySelectorAll(".flipbtn").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    const card = this.closest(".cardarticle").querySelector(".cardflip");
    card.classList.add("flipped");
  });
});

document.querySelectorAll(".backbtn").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    const card = this.closest(".cardarticle").querySelector(".cardflip");
    card.classList.remove("flipped");
  });
});

document.querySelectorAll(".mini-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".mini-card").forEach(c => {
      if (c !== card) c.classList.remove("flipped");
    });
    card.classList.toggle("flipped");
  });
});

/*plot structure*/

setTimeout(() => {
    const mountain = document.getElementById("mt");
    mountain.style.opacity = "1";
    mountain.style.transform = "translateX(-50%) translateY(0px) scale(1)";
}, 800);

setTimeout(() => {
    document.getElementById("mt").classList.add("s1");
}, 600);

setTimeout(() => {
    const elements = document.querySelectorAll('.pt, .ln, .lb');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add("s3p", "s3l", "s3b");
        }, index * 220);
    });
}, 2800);

setTimeout(() => {
    const elements = document.querySelectorAll('.pt, .ln, .lb');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "scale(1) translateY(0)";
        }, index * 250);
    });
}, 2800);

/*activty*/

let draggedCard = null;
let isSubmitted = false;
const CORRECT_ANSWERS = {
    'The story begins with Naomi and her family living a peaceful life in Northern Luzon until a severe drought forces them to move to Mindanao.': 'Exposition',
    'In their new home, her sons marry Ruth and Orpah, but tragedy strikes when Naomi\'s husband and sons die, leaving her widowed and grieving. Naomi decides to return to her hometown, and while Orpah stays behind, Ruth chooses to remain loyal and go with her. Back in Northern Luzon, Ruth works hard in the rice fields and eventually meets Boaz, a kind and generous landowner who notices her dedication and loyalty.': 'Rising Action',
    'Boaz recognizes Ruth\'s good character and decides to take responsibility for her and Naomi.': 'Climax',
    'As time passes, Ruth earns Boaz\'s trust and respect, and he continues to care for them.': 'Falling Action',
    'In the end, Boaz marries Ruth, and they have a son named Obed, bringing joy and restoration to Naomi\'s life.': 'Resolution'
};

document.addEventListener('DOMContentLoaded', function() {
    const cardsContainer = document.querySelector('.cards-container');
    const submitBtn = document.getElementById('submitBtn');
    const resultBtns = document.getElementById('resultBtns');

    function makeDraggable(card) {
        if (isSubmitted) return;
        
        card.draggable = true;
        card.addEventListener('dragstart', function(e) {
            if (isSubmitted) {
                e.preventDefault();
                return false;
            }
            draggedCard = this;
            this.style.opacity = '0.6';
            e.dataTransfer.effectAllowed = 'move';
        });
        card.addEventListener('dragend', function(e) {
            this.style.opacity = '1';
            if (this.parentNode === cardsContainer && !isSubmitted) {
                this.classList.remove('dropped-card');
                this.style.cssText = '';
            }
            draggedCard = null;
        });
    }

    function checkCompletion() {
        if (isSubmitted) return;
        
        const placedCards = document.querySelectorAll('.drop-line');
        const allPlaced = Array.from(placedCards).every(line => line.children.length === 1);
        
        submitBtn.style.display = allPlaced ? 'flex' : 'none';
        resultBtns.style.display = 'none';
    }

    document.querySelectorAll('.draggable').forEach(makeDraggable);
    submitBtn.style.display = 'none';
    resultBtns.style.display = 'none';
    checkCompletion();

    document.querySelectorAll('.story-card').forEach(storyCard => {
        const dropLine = storyCard.querySelector('.drop-line');
        
        storyCard.addEventListener('dragover', function(e) {
            if (isSubmitted) {
                e.preventDefault();
                return false;
            }
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (!dropLine.children.length) {
                dropLine.style.background = '#e0e98e';
                dropLine.style.height = '8px';
            }
        });
        
        storyCard.addEventListener('dragleave', function(e) {
            if (!this.contains(e.relatedTarget)) {
                dropLine.style.background = '#ddd';
                dropLine.style.height = '6px';
            }
        });
        
        storyCard.addEventListener('drop', function(e) {
            if (isSubmitted) {
                e.preventDefault();
                return false;
            }
            e.preventDefault();
            if (draggedCard && !dropLine.children.length) {
                draggedCard.classList.add('dropped-card');
                dropLine.innerHTML = '';
                dropLine.appendChild(draggedCard);
                dropLine.style.background = '#ddd';
                dropLine.style.height = '6px';
                makeDraggable(draggedCard);
                checkCompletion();
            }
        });
    });

    cardsContainer.addEventListener('dragover', function(e) {
        if (isSubmitted) {
            e.preventDefault();
            return false;
        }
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('drag-over');
    });
    
    cardsContainer.addEventListener('dragleave', function(e) {
        if (!this.contains(e.relatedTarget)) this.classList.remove('drag-over');
    });
    
    cardsContainer.addEventListener('drop', function(e) {
        if (isSubmitted) {
            e.preventDefault();
            return false;
        }
        e.preventDefault();
        this.classList.remove('drag-over');
        if (draggedCard) {
            cardsContainer.appendChild(draggedCard);
            checkCompletion();
        }
    });

    submitBtn.addEventListener('click', function() {
        isSubmitted = true;
        
        const dropLines = document.querySelectorAll('.drop-line');
        dropLines.forEach(line => {
            const card = line.querySelector('.dropped-card');
            if (!card) return;
            
            const storyText = line.parentNode.querySelector('.story-text').textContent.trim();
            const userAnswer = card.textContent.trim();
            const correctAnswer = CORRECT_ANSWERS[storyText];
            
            const mark = document.createElement('div');
            mark.className = `check-mark ${userAnswer === correctAnswer ? 'correct' : 'incorrect'}`;
            mark.textContent = userAnswer === correctAnswer ? '✓' : '✗';
            card.appendChild(mark);
            
            card.draggable = false;
        });
        
        submitBtn.style.display = 'none';
        resultBtns.style.display = 'flex';
    });

    document.getElementById('tryAgainBtn').addEventListener('click', function() {
        isSubmitted = false;
        
        document.querySelectorAll('.dropped-card').forEach(card => {
            card.classList.remove('dropped-card');
            card.draggable = true;
            cardsContainer.appendChild(card);
            card.style.cssText = '';
            const mark = card.querySelector('.check-mark');
            if (mark) mark.remove();
        });
        
        document.querySelectorAll('.drop-line').forEach(line => {
            line.innerHTML = '';
            line.style.background = '#ddd';
            line.style.height = '6px';
        });
        
        resultBtns.style.display = 'none';
        checkCompletion();
    });

    document.getElementById('finishBtn').addEventListener('click', function() {
        window.location.href = 'about.html';
    });
});