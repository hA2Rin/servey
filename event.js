/**
 * 하이린 설문조사 최종 JavaScript 통합본
 */

const eventForm = document.getElementById('eventForm');
const submitBtn = document.getElementById('submitBtn');

/**
 * [1] 페이지 전환 로직
 */

// 1페이지 -> 2페이지 이동 (이름, 성별 필수 체크)
function goToNext() {
    const name = document.getElementById('userName').value.trim();
    const gender = document.querySelector('input[name="userGender"]:checked');
    
    document.getElementById('nameError').innerText = "";
    document.getElementById('genderError').innerText = "";

    let valid = true;
    if (!name) { 
        document.getElementById('nameError').innerText = "성함을 입력해 주세요."; 
        valid = false; 
    }
    if (!gender) { 
        document.getElementById('genderError').innerText = "성별을 선택해 주세요."; 
        valid = false; 
    }

    if (valid) {
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
        window.scrollTo(0, 0); // 페이지 상단으로 이동
    }
}

// 2페이지 -> 1페이지 이동
function goToPrev() {
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step1').style.display = 'block';
    window.scrollTo(0, 0);
}


/**
 * [2] 실시간 글자수 및 클릭 감지 검증 (2페이지 주관식 전용)
 */

const textAreas = ['q1', 'q2', 'q4'];

textAreas.forEach(id => {
    const el = document.getElementById(id);
    const errorEl = document.getElementById(id + 'Error');

    // 검증 로직 함수
    const checkLength = () => {
        const len = el.value.trim().length;
        if (len < 10) {
            errorEl.innerText = "10자 이상 작성해야 합니다.";
            errorEl.style.color = "#ff4d4f";
        } else {
            errorEl.innerText = ""; // 10자 달성 시 즉시 삭제
        }
    };

    // 클릭(포커스)했을 때 즉시 경고창 노출 시작
    el.addEventListener('focus', checkLength);

    // 글을 쓰거나 지울 때 실시간 피드백
    el.addEventListener('input', checkLength);
});


/**
 * [3] 데이터 최종 제출 로직
 */

eventForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const q1 = document.getElementById('q1').value.trim();
    const q2 = document.getElementById('q2').value.trim();
    const sat = document.querySelector('input[name="satisfaction"]:checked');
    const q4 = document.getElementById('q4').value.trim();

    let valid = true;

    // 최종 제출 시점에 전체 유효성 다시 한 번 검사
    if (q1.length < 10) { document.getElementById('q1Error').innerText = "10자 이상 작성해야 합니다."; valid = false; }
    if (q2.length < 10) { document.getElementById('q2Error').innerText = "10자 이상 작성해야 합니다."; valid = false; }
    if (!sat) { document.getElementById('satError').innerText = "점수를 선택해 주세요."; valid = false; }
    if (q4.length < 10) { document.getElementById('q4Error').innerText = "10자 이상 작성해야 합니다."; valid = false; }

    if (!valid) {
        alert("작성하지 않았거나 10자 미만인 항목이 있습니다.");
        return;
    }

    // 제출 버튼 비활성화 및 점 세 개 로딩 효과 (· · ·)
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    // 제출 데이터 정리
    const userData = {
        name: document.getElementById('userName').value.trim(),
        gender: document.querySelector('input[name="userGender"]:checked').value,
        impression: q1,
        history: q2,
        score: sat.value,
        message: q4,
        date: new Date().toLocaleString()
    };

    // SheetDB API 전송
    fetch('https://sheetdb.io/api/v1/js0qtxmplb4o5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [userData] })
    })
    .then(res => res.json())
    .then(data => {
        if (data.created === 1) {
            // 성공 시 설문지 숨기고 완료 화면 표시
            document.getElementById('formSection').style.display = 'none';
            document.getElementById('successSection').style.display = 'block';
            window.scrollTo(0, 0);
        } else {
            alert("제출에 실패했습니다. 잠시 후 다시 시도해 주세요.");
            resetButton();
        }
    })
    .catch(() => {
        alert("네트워크 오류가 발생했습니다.");
        resetButton();
    });
});

/**
 * [4] 기타 유틸리티 함수
 */

// 에러 시 버튼 상태 복구
function resetButton() {
    submitBtn.innerHTML = "제출하기";
    submitBtn.disabled = false;
}

// 1페이지 성별 라디오 버튼 선택 시 에러 메시지 즉시 삭제
document.querySelectorAll('input[name="userGender"], input[name="satisfaction"]').forEach(el => {
    el.addEventListener('change', function() {
        const errorDiv = this.closest('.input-card').querySelector('.error-msg');
        if (errorDiv) errorDiv.innerText = "";
    });
});
