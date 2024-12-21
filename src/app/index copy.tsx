import { match } from 'assert';
import { parse } from 'path';
import { FormHTMLAttributes, useEffect, useState } from 'react';

export default function App() {
	const dolar = '$';
	const bolivar = 'Bs.';

	interface FormValues {
		dolarOfficial: number | null;
		dolarParallel: number | null;
		productPrice: number | null;
	}

	const [formValues, setFormValues] = useState<FormValues>({
		dolarOfficial: null,
		dolarParallel: null,
		productPrice: null,
	});

	const [equivalentPercentageOfDolarOfficial, setEquivalentPercentageOfDolarOfficial] = useState<number>(0);
	const [productPriceWithPercentage, setProductPriceWithPercentage] = useState<number>(0);
	const [productIncrease, setProductIncrease] = useState<number>(0);
	const [currencyGap, setCurrencyGap] = useState<number>(0);

	const { dolarOfficial, dolarParallel, productPrice } = formValues;

	/**
	 * Esta función se encarga de calcular la brecha entre el dolar oficial y el dolar paralelo
	 * brecha -> se refiere a la diferencia entre dos valores
	 */
	function calcCurrencyGap() {
		if (dolarOfficial && dolarParallel) {
			const gap = dolarParallel - dolarOfficial;
			setCurrencyGap(gap);
		}
	}

	/**
	 * Esta función se encarga de calcular el porcentaje equivalente de la brecha con respecto al dolar oficial.
	 * Calcula el porcentaje de la brecha con respecto al dolar oficial.
	 * Quiere decir que según sea la brecha, cuanto equivale esa brecha en porcentaje con respecto al dolar oficial.
	 */
	function calcEquivalentPercentage() {
		if (dolarOfficial && currencyGap) {
			const percentage = (currencyGap / dolarOfficial) * 100;
			const percentageFixed = parseFloat(percentage.toFixed(2));
			setEquivalentPercentageOfDolarOfficial(percentageFixed);
		}
	}

	/**
	 * Esta función se encarga de calcular el precio del producto
	 * con respecto al porcentaje equivalente del dolar oficial.
	 */
	function calcProductPriceWithPercentage() {
		if (productPrice && equivalentPercentageOfDolarOfficial) {
			const increase = productPrice * (equivalentPercentageOfDolarOfficial / 100)
			const increaseFixed = parseFloat(increase.toFixed(2));
			setProductIncrease(increaseFixed);
			// const result = parseFloat((productPrice + increase).toFixed(2));
			const total = productPrice + increaseFixed;
			const resultFixed = parseFloat(total.toFixed(2));
			setProductPriceWithPercentage(resultFixed);
		}
	}



	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;

		if (value === '') {
			setFormValues({
				...formValues,
				[name]: null,
			});
			return;
		}

		const parsedValue = parseFloat(Math.abs(Number(value)).toFixed(2));
		setFormValues({
			...formValues,
			[name]: isNaN(parsedValue) ? null : parsedValue,
		});
	}

	function handleReset() {
		const emptyFormValues = Object.keys(formValues).reduce((acc, key) => {
			acc[key as keyof FormValues] = null; // Convertir la clave a un tipo conocido
			return acc;
		}, {} as FormValues); // Inicializar el acumulador como un objeto vacío con las mismas claves que formValues (type assertion)
		setFormValues(emptyFormValues);

		setEquivalentPercentageOfDolarOfficial(0);
		setProductIncrease(0);
		setCurrencyGap(0);
		setProductPriceWithPercentage(0);
	}

	useEffect(() => {
		calcCurrencyGap();
		calcEquivalentPercentage();
		calcProductPriceWithPercentage();
	}, [formValues]);

	return (
		<>
			<div className='mb-10 bg'>
				<p>Dolar oficial: ....................................................................{dolarOfficial ?? 0} {bolivar}</p>
				<p>Dolar paralelo: ................................................................{dolarParallel ?? 0} {bolivar}</p>
				<p>Brecha cambiaria: ..........................................................{currencyGap ?? 0} {bolivar}</p>
				<p>Precio del producto: ......................................................{productPrice ?? 0} {dolar}</p>
				<p>Porcentaje equivalente de dolar oficial ({dolarOfficial ?? 0} {bolivar}): ........{equivalentPercentageOfDolarOfficial}%</p>
				<p>Aumento del producto: ................................................{productIncrease}$</p>
				<p>El precio del producto debe ser: .................................{productPriceWithPercentage} {dolar}</p>
			</div>


			{/* Formulario */}
			<form className='formContainer'>
				{/* Dolar oficial */}
				<div className='inputContainer'>
					<label htmlFor="dolarOfficial" className='inputLabel'>Dolar oficial</label>
					<input
						type="number"
						name="dolarOfficial"
						id="dolarOfficial"
						placeholder="Dolar oficial"
						value={dolarOfficial ?? ""}
						onChange={handleChange}
						className='inputText'
					/>
				</div>

				{/* Dolar paralelo */}
				<div className='inputContainer'>
					<label htmlFor="dolarParallel" className='inputLabel'>Dolar paralelo</label>
					<input
						type="number"
						name="dolarParallel"
						id="dolarParallel"
						placeholder="Dolar paralelo"
						value={dolarParallel ?? ''}
						onChange={handleChange}
						className='inputText'
					/>
				</div>

				{/* Precio de producto*/}
				<div className='inputContainer'>
					<label htmlFor="productPrice" className='inputLabel'>Precio de producto en $</label>
					<input
						type="number"
						name="productPrice"
						id="productPrice"
						placeholder="Precio de producto"
						value={productPrice ?? ''}
						onChange={handleChange}
						className='inputText'
					/>
				</div>

				{/* Botones */}
				<div className='btnsContainer'>
					<button onClick={handleReset} type='button' className='btn'>Resetear</button>
				</div>
			</form>
		</>
	);
}

