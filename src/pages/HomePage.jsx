import { Search } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import { useEffect, useState } from "react";
import { getRandomColor } from "../lib/utils";

const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php";


const HomePage = () => {
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchRecipes = async (searchQuery) => {
		setLoading(true);
		setRecipes([]);

		try {
			const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
			const data = await res.json();

			// Debugging: Check API response
			console.log("API Response:", data);

			if (!data.meals) {
				throw new Error("No recipes found.");
			}

			// Transform API response to match RecipeCard.jsx expected format
			const formattedRecipes = data.meals.map((meal) => ({
				id: meal.idMeal, // Unique ID
				title: meal.strMeal, // Recipe title
				image: meal.strMealThumb, // Recipe image
				cuisine: meal.strArea || "Unknown", // Cuisine type
				healthLabels: meal.strTags ? meal.strTags.split(",") : [], // Convert tags to array, default to []
				servings: "N/A", // TheMealDB doesn't provide servings, so default to "N/A"
				youtubeLink: meal.strYoutube || "", // Recipe video link
			}));

			console.log("Formatted Recipes:", formattedRecipes); // Debugging

			setRecipes(formattedRecipes);
		} catch (error) {
			console.error("API fetch error:", error.message);
			setRecipes([]); // Prevent errors by ensuring recipes is always an array
		} finally {
			setLoading(false);
		}
	};


	useEffect(() => {
		fetchRecipes("chicken");
	}, []);

	const handleSearchRecipe = (e) => {
		e.preventDefault();
		fetchRecipes(e.target[0].value);
	};

	return (
		<div className='bg-[#faf9fb] p-10 flex-1'>
			<div className='max-w-screen-lg mx-auto'>
				<form onSubmit={handleSearchRecipe}>
					<label className='input shadow-md flex items-center gap-2'>
						<Search size={"24"}/>
						<input
							type='text'
							className='text-sm md:text-md grow'
							placeholder='What do you want to cook today?'
						/>
					</label>
				</form>

				<h1 className='font-bold text-3xl md:text-5xl mt-4'>Recommended Recipes</h1>
				<p className='text-slate-500 font-semibold ml-1 my-2 text-sm tracking-tight'>Popular choices</p>

				<div className='grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
					{
						!loading &&
						recipes.map((recipe, index) => (
							<RecipeCard key={index} recipe={recipe} {...getRandomColor()} />
						))
					}

					{loading &&
						[...Array(9)].map((_, index) => (
							<div key={index} className='flex flex-col gap-4 w-full'>
								{/* skeleton loaders */}
							</div>
						))
					}
				</div>
			</div>
		</div>
	);
};
export default HomePage;
