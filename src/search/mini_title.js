const { query } = require("../interfaces/db");
const { question } = require("../interfaces/std");

console.log("pid:" + process.pid);

function search(title, year) {
    let titleSQL =
        "SELECT " +
        "tb.tconst," +
        "tb.primary_title," +
        "tb.start_year," +
        "tb.runtime_minutes," +
        "tb.genres," +
        "tc.directors AS directorsIds," +
        "tc.writers AS writersIds " +
        "FROM title_basics AS tb " +
        "LEFT JOIN title_crew AS tc " +
        "ON tb.tconst = tc.tconst " +
        "WHERE " +
        "UPPER(tb.primary_title) LIKE '%" + title.toUpperCase() + "%'";

    if (year) {
        titleSQL += " AND start_year=" + year;
    }

    query(titleSQL)
        .then(titleResults => {
            return new Promise(resolve => {
                let promises = [];

                titleResults.forEach(title => {

                    title.directors = [];
                    title.directorsIds && title.directorsIds.split(",").forEach(directorId => {
                        promises.push(query("SELECT primary_name FROM name_basics WHERE nconst='" + directorId + "'")
                            .then(nameResults => {
                                title.directors.push(nameResults[0].primary_name);
                            })
                        )
                    });
                    delete title.directorsIds;

                    title.writers = [];
                    title.writersIds && title.writersIds.split(",").forEach(writerId => {
                        promises.push(query("SELECT primary_name FROM name_basics WHERE nconst='" + writerId + "'")
                            .then(nameResults => {
                                title.writers.push(nameResults[0].primary_name);
                            })
                        );
                    });
                    delete title.writersIds;
                });

                Promise.all(promises)
                    .then(() => {
                        resolve(titleResults);
                    });
            })
        })
        .then((results) => {
            console.log(JSON.stringify(results, null, 4));
        });
}

question("Title name?: ")
    .then(title => {
        question("Year? (leave empty for any): ")
            .then(year => {
                search(title, year);
            })
    })