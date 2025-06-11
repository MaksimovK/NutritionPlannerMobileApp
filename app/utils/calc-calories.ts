/**
 * Рассчитывает дневную норму калорий по формуле Миффлина-Сан Жеора
 * @param gender Пол ('male' или 'female')
 * @param weight Вес в килограммах
 * @param height Рост в сантиметрах
 * @param age Возраст в годах
 * @param activityLevelId Числовой идентификатор уровня физической активности (1–5)
 * @returns Дневная норма калорий
 */
const calculateCalories = (
	gender: string,
	weight: number,
	height: number,
	age: number,
	activityLevelId: number
): number => {
	// Базовая скорость метаболизма (BMR) по полу
	const bmr =
		gender === 'male'
			? 10 * weight + 6.25 * height - 5 * age + 5
			: 10 * weight + 6.25 * height - 5 * age - 161

	// Коэффициенты физической активности
	const activityFactors: Record<number, number> = {
		1: 1.2, // Сидячий образ жизни
		2: 1.375, // Лёгкая активность
		3: 1.55, // Умеренная активность
		4: 1.725, // Высокая активность
		5: 1.9 // Экстремальная активность
	}

	// Проверяем, что переданный идентификатор активности корректен
	if (!activityFactors[activityLevelId]) {
		throw new Error(
			'Некорректный уровень физической активности. Ожидается значение от 1 до 5.'
		)
	}

	// Расчёт дневной нормы калорий
	return bmr * activityFactors[activityLevelId]
}

export default calculateCalories
