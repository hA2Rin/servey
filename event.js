const eventForm = document.getElementById('eventForm');
const submitBtn = document.getElementById('submitBtn');

// 1페이지 -> 2페이지 이동
function goToNext() {
    const name = document.getElementById('userName').value.trim();
    const gender = document.querySelector('input[name="userGender"]:checked');
    
    let valid = true;
    if (!name) { document.getElementById('nameError').innerText = "성함을 입력해 주세요."; valid = false; }
    if (!gender) { document.getElementById('genderError').innerText = "성별을 선택해 주세요."; valid = false; }

    if (valid) {
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
        window.scrollTo(0, 0);
    }
}

// 2페이지 -> 1페이지 이동
function goToPrev() {
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step1').style.display = 'block';
    window.scrollTo(0, 0);
}

// 최종 제출
eventForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // 2페이지 유효성 검사
    const q1 = document.getElementById('q1').value.trim();
    const q2 = document.getElementById('q2').value.trim();
    const sat = document.querySelector('input[name="satisfaction"]:checked');
    const q4 = document.getElementById('q4').value.trim();

    if (!q1 || !q2 || !sat || !q4) {
        alert("모든 필수 항목을 입력해 주세요.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "제출 중...";

    const userData = {
        name: document.getElementById('userName').value.trim(),
        gender: document.querySelector('input[name="userGender"]:checked').value,
        impression: q1,
        history: q2,
        score: sat.value,
        message: q4,
        date: new Date().toLocaleString()
    };

    fetch('https://sheetdb.io/api/v1/js0qtxmplb4o5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [userData] })
    })
    .then(res => res.json())
    .then(data => {
        if (data.created === 1) {
            document.getElementById('formSection').style.display = 'none';
            document.getElementById('successSection').style.display = 'block';
        } else {
            alert("제출 실패");
            submitBtn.disabled = false;
            submitBtn.innerText = "제출하기";
        }
    });
});

// 실시간 에러 메시지 삭제
document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => {
        const err = el.closest('.input-card')?.querySelector('.error-msg');
        if (err) err.innerText = "";
    });
});