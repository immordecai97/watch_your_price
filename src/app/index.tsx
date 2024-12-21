import { useEffect, useState } from 'react';

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

	const [errorMessage, setErrorMessage] = useState<boolean>(false);

	const { dolarOfficial, dolarParallel, productPrice } = formValues;

	const currencyGap = dolarParallel && dolarOfficial
		? parseFloatAndFixed(dolarParallel - dolarOfficial, 2)
		: 0;
	const equivalentPercentageOfDolarOfficial = dolarOfficial && currencyGap
		? parseFloatAndFixed((currencyGap / dolarOfficial) * 100, 2)
		: 0;
	const productIncrease = productPrice && equivalentPercentageOfDolarOfficial
		? parseFloatAndFixed(productPrice * (equivalentPercentageOfDolarOfficial / 100), 2)
		: 0;
	const productPriceWithPercentage = productPrice && productIncrease
		? parseFloatAndFixed(productPrice + productIncrease, 2)
		: 0;

	function parseFloatAndFixed(value: number | null, fixed: number = 2) {
		return value ? parseFloat(value.toFixed(fixed)) : 0;
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		const numberValue = value ? parseFloat(value) : null;
		setFormValues({ ...formValues, [name]: numberValue });
	}

	function handleReset() {
		const emptyFormValues = Object.keys(formValues).reduce((acc, key) => {
			acc[key as keyof FormValues] = null; // Convertir la clave a un tipo conocido
			return acc;
		}, {} as FormValues); // Inicializar el acumulador como un objeto vacío con las mismas claves que formValues (type assertion)
		setFormValues(emptyFormValues);
	}

	useEffect(() => {
		if (dolarOfficial && dolarParallel && dolarOfficial > dolarParallel) {
			setErrorMessage(true);
			return;
		}
		setErrorMessage(false);
	}, [dolarOfficial, dolarParallel]);

	return (
		<>
			<div className='mb-10 bg'>
				<p>Dolar oficial: ....................................................................{dolarOfficial ?? 0} {bolivar}</p>
				<p>Dolar paralelo: ................................................................{dolarParallel ?? 0} {bolivar}</p>
				<p>Brecha cambiaria: ..........................................................{currencyGap ?? 0} {bolivar}</p>
				<p>Porcentaje equivalente de dolar oficial ({dolarOfficial ?? 0} {bolivar}): ........{equivalentPercentageOfDolarOfficial}%</p>
				<p>Precio del producto: ......................................................{productPrice ?? 0} {dolar}</p>
				<p>Aumento del producto: ................................................{productIncrease}$</p>
				<p>El precio del producto debe ser: .................................{productPriceWithPercentage} {dolar}</p>
			</div>

			<h1 className='text-center my-8 text-4xl text-white'>Ajusta tu precio</h1>

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

			{errorMessage && <p className='error text-center my-8 text-red-600 text-2xl'>El dolar oficial debe ser menor o igual al dolar paralelo</p>}

		</>
	);
}

