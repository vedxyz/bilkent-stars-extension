import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import fs from "fs/promises";

const getOfferings = async (courseCode, semester) => {
    
    const page = await fetch(`https://stars.bilkent.edu.tr/homepage/ajax/plainOfferings.php?COURSE_CODE=${courseCode}&SEMESTER=${semester}`);
    const rows = new JSDOM(await page.text()).window.document.body.querySelectorAll("#poTable > tbody tr");
    
    const offerings = [];
    
    rows.forEach((row) => {
        const [courseCode, section] = row.querySelector("td:nth-child(1)").textContent.split("-");
        const courseName = row.querySelector("td:nth-child(2)").textContent;
        const instructor = row.querySelector("td:nth-child(3) > span:first-child > div:first-child")?.textContent || row.querySelector("td:nth-child(3)").textContent;
        
        const quota = {};
        const quotaString = row.querySelector("td:nth-child(8)").textContent;
        
        if (quotaString.indexOf("or") !== -1) {
            quota.indifferent = true;
            quota.total = quotaString.match(/(\d+) Mand/)[1];
        } else if (quotaString.indexOf("Unlimited") !== -1) {
            quota.indifferent = true;
            quota.total = Infinity;
        } else {
            const [_match, mandatory, elective] = quotaString.match(/(\d+) Mand\. (\d+) Elect\./);
            quota.indifferent = false;
            quota.mandatory = mandatory;
            quota.elective = elective;
        }
        
        const schedule = row.querySelector("td:nth-child(15)").textContent === "" ? "N/A" : row.querySelector("td:nth-child(15)").textContent.split("\n").slice(0, -1).map((date) => {
            
            const [day, timeframe, place] = date.trim().split(" ");
            const [start, end] = timeframe.split("-");
            return {
                day,
                time: {
                    start,
                    end,
                },
                place,
            };
        });
        
        let course = offerings.find((el) => el.courseCode === courseCode);
        
        if (course === undefined) {
            course = {
                courseCode,
                courseName,
                sections: [],
            };
            offerings.push(course);
        }
        
        course.sections.push({
            section,
            instructor,
            quota,
            schedule,
        });
    });
    
    return offerings;
};

const writeOfferingsToFile = async (offerings, filename) => {
    await fs.writeFile(filename, offerings.map(course => 
        `${course.courseCode} - ${course.courseName}:\n` + 
        course.sections.map(section => 
            `\t${section.section} | ${
                section.quota.indifferent ? `${section.quota.total} Total` : 
                `${section.quota.mandatory} Mand., ${section.quota.elective} Elect.`
            } | ${section.instructor};\n` + 
            (section.schedule === "N/A" ? "\t\tSchedule N/A" : section.schedule.map(point => 
                `\t\t${point.day}, ${point.time.start}-${point.time.end} @ ${point.place}`
            ).join("\n"))
        ).join("\n")
    ).join("\n\n"), { encoding: "utf-8" });
};

const saveOfferingsToFile = async (courseCode, semester) => {
    await writeOfferingsToFile(
        await getOfferings(courseCode, semester), 
        `${courseCode} - ${semester.substring(0, 4)} - ${["Fall", "Spring", "Summer"][semester.charAt(4) - 1]}.txt`
    );
};

const saveOfferingsToJSON = async (courseCode, semester, prettify) => {
    await fs.writeFile(
        `${courseCode}_${semester.substring(0, 4)}_${["fall", "spring", "summer"][semester.charAt(4) - 1]}.json`, 
        JSON.stringify(await getOfferings(courseCode, semester), null, prettify ? 2 : 0), 
        { encoding: "utf-8" }
    );
};

await saveOfferingsToJSON("CS", "20211", true);
await saveOfferingsToJSON("HIST", "20211", true);
await saveOfferingsToJSON("HUM", "20211", true);
await saveOfferingsToJSON("PHYS", "20211", true);
await saveOfferingsToJSON("CHEM", "20211", true);
await saveOfferingsToJSON("ECON", "20211", true);
await saveOfferingsToJSON("EEE", "20211", true);
await saveOfferingsToJSON("ENG", "20211", true);
await saveOfferingsToJSON("IE", "20211", true);
await saveOfferingsToJSON("LAW", "20211", true);
await saveOfferingsToJSON("MATH", "20211", true);
await saveOfferingsToJSON("MBG", "20211", true);
await saveOfferingsToJSON("PSYC", "20211", true);
await saveOfferingsToJSON("TURK", "20211", true);
