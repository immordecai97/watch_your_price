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
				<li className='col-span-2 card'>
					<p className='text-center'>
						<label htmlFor="dolarOfficial">Dólar oficial</label>
					</p>
					<div className='inputContainer'>
						<input
							type="number"
							name="dolarOfficial"
							id="dolarOfficial"
							placeholder="0"
							value={(dolarOfficial) || ""}
							onChange={handleChange}
							className='inputText'
						/>
						<p>Bs.</p>
					</div>
				</li>

				<li className='col-span-2 card'>
					<p className='text-center'>
						<label htmlFor="dolarOfficial">Dólar paralelo</label>
					</p>
					<div className='inputContainer'>
						<input
							type="number"
							name="dolarParallel"
							id="dolarParallel"
							placeholder="0"
							value={dolarParallel ?? ''}
							onChange={handleChange}
							className='inputText'
						/>
						<p>Bs.</p>
					</div>
				</li>

				<li className='col-span-2 card'>
					<p className='text-center'>
						<label htmlFor="dolarOfficial">Precio del prod.</label>
					</p>
					<div className='inputContainer'>
						<input
							type="number"
							name="productPrice"
							id="productPrice"
							placeholder="0"
							value={productPrice ?? ''}
							onChange={handleChange}
							className='inputText'
						/>
						<p>$</p>
					</div>
				</li>

				<li className='card'>
					<h3 className='text-center'>Brecha</h3>
					<div className='inputContainer'>
						<p className='card-text w-full'>
							{currencyGap ?? 0}
						</p>
						<p>Bs.</p>
					</div>
				</li>

				<li className='card'>
					<h3 className='text-center'>Brecha %</h3>
					<div className='inputContainer'>
						<p className='card-text w-full'>
							{equivalentPercentageOfDolarOfficial}
						</p>
						<p>%</p>
					</div>
				</li>

				<li className='card'>
					<h3 className='text-center'>Aumento</h3>
					<div className='inputContainer'>
						<p className='card-text w-full'>
							{productIncrease}
						</p>
						<p>$</p>
					</div>
				</li>

				<li className='card'>
					<h3 className='text-center'>Precio total</h3>
					<div className='inputContainer'>
						<p className='card-text w-full'>
							{productPriceWithPercentage}
						</p>
						<p>$</p>
					</div>
				</li>
			</ul>
			<div className='btnsContainer'>
				<button onClick={handleReset} type='button' className='btn'>Resetear</button>
			</div>
		</>
	);
}