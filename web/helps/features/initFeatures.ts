/** @format */

import SiteStats from "../../models/features.model";

const initStats = async (): Promise<void> => {
	try {
		let stats = await SiteStats.findOne();
		if (!stats) {
			stats = new SiteStats();
			await stats.save();
			console.log("Site stats initialized");
		}
	} catch (err: any) {
		console.error(err.message);
	}
};

export default initStats;
