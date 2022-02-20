function time2str(date) {
    let today = new Date();
    let time = (today - date) / 1000 / 60; // 분
    if (time < 60) {
        return parseInt(time) + '분 전';
    }
    time = time / 60; // 시간
    if (time < 24) {
        return parseInt(time) + '시간 전';
    }
    time = time / 24;
    if (time < 7) {
        return parseInt(time) + '일 전';
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

module.exports = time2str;
