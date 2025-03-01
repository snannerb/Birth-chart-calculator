// Event Listener for Generate Chart Button
document.getElementById('generateChart').addEventListener('click', generateChart);

// Function to Get Zodiac Sign
function getZodiacSign(birthDate) {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1; // Months are 0-indexed
  const day = date.getDate();

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  if ((month === 3 && day >= 21极光ων生成图表函数
function generateChart() {
  const birthDate = document.getElementById('birthDate').value;
  const birthLocation = document.getElementById('birthLocation').value;
  const birthTime = document.getElementById('birthTime').value;

  // 输入验证
  if (!birthDate || !birthLocation || !birthTime) {
    alert("请填写所有字段。");
    return;
  }

  // 验证日期格式
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(birthDate)) {
    alert("请输入有效的日期，格式为YYYY-MM-DD。");
    return;
  }

  // 验证时间格式
  const timePattern = /^\d{2}:\d{2}$/;
  if (!timePattern.test(birthTime)) {
    alert("请输入有效的时间，格式为HH:MM。");
    return;
  }

  // 获取星座
  const zodiacSign = getZodiacSign(birthDate);

  // 更新图表显示
  document.getElementById('chartDisplay').innerHTML = `
    <h2>星座: ${zodiacSign}</h2>
    <p>出生日期: ${birthDate}</p>
    <p>出生地点: ${birthLocation}</p>
    <p>出生时间: ${birthTime}</p>
  `;

  // 更新解释部分
  const explanations = {
    Aquarius: "水瓶座以独立和创新著称。",
    Pisces: "双鱼座以共情和创造力著称。",
    Aries: "白羊座以活力和领导力著称。",
    Taurus: "金牛座以决心和可靠性著称。",
    Gemini: "双子座以适应力和沟通能力著称。",
    Cancer: "巨蟹座以敏感和忠诚著称。",
    Leo: "狮子座以自信和魅力著称。",
    Virgo: "处女座以实际和对细节的关注著称。",
    Libra: "天秤座以平衡和外交能力著称。",
    Scorpio: "天蝎座以强度和激情著称。",
    Sagittarius: "射手座以乐观和冒险精神著称。",
    Capricorn: "摩羯座以雄心和组织能力著称。"
  };

  document.getElementById('explanations').innerHTML = `<h2>解释:</h2><p>${explanations[zodiacSign]}</p>`;

  // 显示渐变效果
  document.getElementById('chartDisplay').classList.add('show');
  document.getElementById('explanations').classList.add('show');
}