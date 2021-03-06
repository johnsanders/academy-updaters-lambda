import fetch from 'node-fetch';

const excludeCategories = [4, 45, 51];
const sortByDate = (a: string, b: string) => {
	const aDate = new Date(a);
	const bDate = new Date(b);
	return aDate.getTime() - bDate.getTime();
};

const getNewsourceBlog = async (): Promise<any[]> => {
	const res = await fetch('https://www.cnnnewsource.com/wp-json/wp/v2/posts?_embed=1&per_page=20');
	const text = await res.text();
	const json = JSON.parse(text);
	const filtered = json.filter((article: any) => {
		return !excludeCategories.some((excludeCategory) =>
			article.categories.includes(excludeCategory),
		);
	});
	const sorted = filtered.sort(sortByDate);
	const articles = sorted.map((article: any) => ({
		date: article.date_gmt,
		imageUrl: article._embedded['wp:featuredmedia'][0].source_url,
		linkUrl: article.link,
		title: article.title.rendered,
	}));
	return articles;
};

export default getNewsourceBlog;
