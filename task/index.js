const fs = require('fs');
const readline = require('readline');

async function analyzeStudies2025() {
    const fileStream = fs.createReadStream('company_studies.jsonl');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const studies2025 = [];
    const countryCount = {};
    const monthCount = {};

    for await (const line of rl) {
        const study = JSON.parse(line);
        
        if (study.date_created && study.date_created.startsWith('2025')) {
            studies2025.push(study);
            
            const month = study.date_created.substring(5, 7);
            monthCount[month] = (monthCount[month] || 0) + 1;
            
            study.countries.forEach(country => {
                countryCount[country] = (countryCount[country] || 0) + 1;
            });
        }
    }

    const sortedCountries = Object.entries(countryCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);

    const sortedMonths = Object.entries(monthCount)
        .sort(([,a], [,b]) => b - a);

    const monthNames = {
        '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
        '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
        '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
    };

    console.log('🎄 YOUR 2025 COMPANY STUDIES WRAPPED 🎄\n');
    console.log(`📊 Total Studies Created in 2025: ${studies2025.length}`);
    console.log('\n🌍 Most Searched Countries:');
    sortedCountries.forEach(([country, count], index) => {
        console.log(`${index + 1}. ${country}: ${count} studies`);
    });

    console.log('\n📅 Busiest Month for Study Creation:');
    if (sortedMonths.length > 0) {
        const [busiestMonth, count] = sortedMonths[0];
        console.log(`🔥 ${monthNames[busiestMonth]}`);
        
        console.log('\nMonthly Breakdown:');
        sortedMonths.forEach(([month, count]) => {
            const bar = '█'.repeat(Math.ceil(count / Math.max(...Object.values(monthCount)) * 20));
            console.log(`${monthNames[month]}: ${bar} ${count}`);
        });
    }
}

analyzeStudies2025().catch(console.error);