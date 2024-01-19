(function (global) {
	var Salary = function (salary, discounts) {
		return new Salary.init(salary, discounts);
	}; // Criando uma função que inicializa o objeto Salary sem precisar sempre usar new

	var INSSTable = {
		1412: {
			percentage: 0.075,
			deduction: 0,
		},
		2666.68: {
			percentage: 0.09,
			deduction: 21.18,
		},
		4000.03: {
			percentage: 0.12,
			deduction: 101.18,
		},
		7786.02: {
			percentage: 0.14,
			deduction: 181.18,
			limit: true,
		},
	};

	var IRTable = {
		2112: {
			percentage: 0,
			deduction: 0,
		},
		2826.65: {
			percentage: 0.075,
			deduction: 158.4,
		},
		3751.05: {
			percentage: 0.15,
			deduction: 370.4,
		},
		4664.68: {
			percentage: 0.275,
			deduction: 884.96,
		},
	};

	function getDiscountRate (discountTable, salary = this.salary) {
		let rate = Object.keys(discountTable).find(
			(salaryLimit) => salary <= salaryLimit
		);

		rate = rate || Object.keys(discountTable).pop();

		return {
			...discountTable[rate],
			rate,
		};
	};

	function calculateDiscount (discountRate, $salary) {
		let salary = $salary || this.salary;

		const { percentage, deduction, limit, rate } = discountRate;

		if (limit && salary > rate) salary = rate;

		return salary * percentage - deduction;
	};


	Salary.prototype = {
		getLiquidSalary: function () {
			const INSSDiscount = calculateDiscount(getDiscountRate(INSSTable));
			const INSSDiscounted = this.salary - INSSDiscount;
			const IRDiscount = calculateDiscount(
				getDiscountRate(IRTable, INSSDiscounted),
				INSSDiscounted
			);

			return {
				salary: this.salary,
				discounts: this.discounts,
				inss: INSSDiscount,
				ir: IRDiscount,
				liquid_salary: INSSDiscounted - IRDiscount - this.discounts,
			};
		},
	};

	Salary.init = function (salary = 1412, discounts = 0) {
		var self = this;
		self.salary = salary;
		self.discounts = discounts;
	}; // Definindo o que a função de inicialização vai fazer

	Salary.init.prototype = Salary.prototype; // Apontando o prototype da função init para o do próprio Objeto

	global.Salary = global.S$ = Salary; // Criando um alias S$ que aponta para o Objeto
})(window); // Encapsulando os dados e o objeto global
