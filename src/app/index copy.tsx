import { useEffect, useState } from 'react';

export default function App() {

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
			<h1 className='text-center mt-4 text-4xl text-white'>Ajusta tu precio</h1>
			{/* Tarjetas */}
			<ul className='ul-container'>
				<li className='card'>
					<h3 className='text-center'>Dólar oficial</h3>
					<div className='card-content'>
						<p className='card-text'>
							{dolarOfficial ?? 0}
							<span className='text-sm absolute -right-6 bottom-1'>Bs.</span>
						</p>
					</div>
				</li>
				<li className='card'>
					<h3 className='text-center'>Dólar paralelo</h3>
					<div className='card-content'>
						<p className='card-text'>
							{dolarParallel ?? 0}
							<span className='text-sm absolute -right-6 bottom-1'>Bs.</span>
						</p>
					</div>
				</li>
				<li className='card'>
					<h3 className='text-center'>Brecha</h3>
					<div className='card-content'>
						<p className='card-text'>
							{currencyGap ?? 0}
							<span className='text-sm absolute -right-6 bottom-1'>Bs.</span>
						</p>
					</div>
				</li>
				<li className='card'>
					<h3 className='text-center'>Brecha %</h3>
					<div className='card-content'>
						<p className='card-text'>
							{equivalentPercentageOfDolarOfficial}
							<span className='text-sm absolute -right-6 bottom-1'>%</span>
						</p>
					</div>
				</li>
				<li className='card'>
					<h3 className='text-center'>Precio del producto</h3>
					<div className='card-content'>
						<p className='card-text'>
							{productPrice ?? 0}
							<span className='text-sm absolute -right-6 bottom-1'>$</span>
						</p>
					</div>
				</li>
				<li className='card'>
					<h3 className='text-center'>Aumento</h3>
					<div className='card-content'>
						<p className='card-text'>
							{productIncrease}
							<span className='text-sm absolute -right-6 bottom-1'>$</span>
						</p>
					</div>
				</li>
				<li className='col-span-2 card '>
					<h3 className='text-center'>Total precio del producto</h3>
					<div className='card-content'>
						<p className='card-text'>
							{productPriceWithPercentage}
							<span className='text-sm absolute -right-6 bottom-1'>$</span>
						</p>
					</div>
				</li>
			</ul>

			{/* Formulario */}
			<form className='formContainer'>
				{/* Dólar oficial */}
				<div className='inputContainer'>
					<label htmlFor="dolarOfficial" className='inputLabel'>Dólar oficial</label>
					<input
						type="number"
						name="dolarOfficial"
						id="dolarOfficial"
						placeholder="Dólar oficial"
						value={dolarOfficial ?? ""}
						onChange={handleChange}
						className='inputText'
					/>
				</div>

				{/* Dólar paralelo */}
				<div className='inputContainer'>
					<label htmlFor="dolarParallel" className='inputLabel'>Dólar paralelo</label>
					<input
						type="number"
						name="dolarParallel"
						id="dolarParallel"
						placeholder="Dólar paralelo"
						value={dolarParallel ?? ''}
						onChange={handleChange}
						className='inputText'
					/>
					{errorMessage && <p className=' mt-2 text-rose-500 text-sm'>El dólar paralelo debe ser mayor al dólar oficial</p>}
				</div>

				{/* Precio del producto */}
				<div className='inputContainer'>
					<label htmlFor="productPrice" className='inputLabel'>Precio del producto en $</label>
					<input
						type="number"
						name="productPrice"
						id="productPrice"
						placeholder="Precio del producto"
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