import { Heart, HeartPulse, Soup } from "lucide-react";
import { useState } from "react";

const getTwoValuesFromArray = (arr) => {
	return arr && arr.length > 0 ? arr.slice(0, 2) : ["No Health Info"];
};

const RecipeCard = ({ recipe, bg, badge }) => {
	// Ensure valid data mapping
	const healthLabels = getTwoValuesFromArray(recipe.healthLabels);
	const cuisine = recipe.cuisine || "Unknown"; // Use `cuisine`
	const recipeTitle = recipe.title || "No Title";
	const recipeImage = recipe.image || "default-image.jpg";

	// Handle favorites logic
	const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
	const isFavorite = storedFavorites.some((fav) => fav.title === recipe.title);

	const [favorite, setFavorite] = useState(isFavorite);

	const addRecipeToFavorites = () => {
		let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
		const isAlreadyFavorited = favorites.some((fav) => fav.title === recipe.title);

		if (isAlreadyFavorited) {
			favorites = favorites.filter((fav) => fav.title !== recipe.title);
			setFavorite(false);
		} else {
			favorites.push(recipe);
			setFavorite(true);
		}

		localStorage.setItem("favorites", JSON.stringify(favorites));
	};

	return (
		<div className={`flex flex-col rounded-md ${bg} overflow-hidden p-3 relative`}>
			<a
				href={recipe.youtubeLink ? recipe.youtubeLink : `https://www.youtube.com/results?search_query=${recipeTitle} recipe`}
				target='_blank'
				rel='noopener noreferrer'
				className='relative h-32'
			>
				<div className='skeleton absolute inset-0' />
				<img
					src={recipeImage}
					alt={recipeTitle}
					className='rounded-md w-full h-full object-cover cursor-pointer opacity-0 transition-opacity duration-500'
					onLoad={(e) => {
						e.currentTarget.style.opacity = 1;
						e.currentTarget.previousElementSibling.style.display = "none";
					}}
				/>
				<div
					className='absolute bottom-2 left-2 bg-white rounded-full p-1 cursor-pointer flex items-center gap-1 text-sm'
				>
					{/*<Soup size={16} /> {recipe.servings || "N/A"} Servings*/}
				</div>

				<div
					className='absolute top-1 right-2 bg-white rounded-full p-1 cursor-pointer'
					onClick={(e) => {
						e.preventDefault();
						addRecipeToFavorites();
					}}
				>
					{!favorite ? (
						<Heart size={20} className='hover:fill-red-500 hover:text-red-500' />
					) : (
						<Heart size={20} className='fill-red-500 text-red-500' />
					)}
				</div>
			</a>

			<div className='flex mt-1'>
				<p className='font-bold tracking-wide'>{recipeTitle}</p>
			</div>
			<p className='my-2'>{cuisine} Kitchen</p>

			<div className='flex gap-2 mt-auto'>
				{healthLabels.map((label, idx) => (
					<div key={idx} className={`flex gap-1 ${badge} items-center p-1 rounded-md`}>
						<HeartPulse size={16} />
						<span className='text-sm tracking-tighter font-semibold'>{label}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default RecipeCard;
