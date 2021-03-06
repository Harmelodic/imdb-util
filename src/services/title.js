const { query } = require("../db");

exports.lookupMini = (tconst) => {
    let titleSQL =
        "SELECT " +
        "tb.tconst," +
        "tb.primary_title," +
        "tb.start_year," +
        "tb.end_year," +
        "tb.runtime_minutes," +
        "tb.genres," +
        "tc.directors AS directorsIds," +
        "tc.writers AS writersIds " +
        "FROM title_basics AS tb " +
        "LEFT JOIN title_crew AS tc " +
        "ON tb.tconst = tc.tconst " +
        "WHERE " +
        "UPPER(tb.tconst) LIKE '%" + tconst.toUpperCase() + "%'";

    return query(titleSQL)
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
                        resolve(titleResults[0]);
                    });
            })
        })
}

exports.findMini = (title, year) => {
    let titleSQL =
        "SELECT " +
        "tb.tconst," +
        "tb.primary_title," +
        "tb.start_year," +
        "tb.end_year," +
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

    return query(titleSQL)
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
}

exports.find = (title, year) => {
    let titleSQL =
        "SELECT " +
        "tb.tconst," +
        "tb.title_type," +
        "tb.primary_title," +
        "tb.original_title," +
        "tb.is_adult," +
        "tb.start_year," +
        "tb.end_year," +
        "tb.runtime_minutes," +
        "tb.genres," +
        "tc.directors AS directorsIds," +
        "tc.writers AS writersIds," +
        "te.parent_tconst," +
        "te.season_number," +
        "te.episode_number," +
        "tr.average_rating," +
        "tr.num_votes " +
        "FROM title_basics AS tb " +
        "LEFT JOIN title_crew AS tc " +
        "ON tb.tconst = tc.tconst " +
        "LEFT JOIN title_episode AS te " +
        "ON tb.tconst = te.tconst " +
        "LEFT JOIN title_ratings AS tr " +
        "ON tb.tconst = tr.tconst " +
        "WHERE " +
        "UPPER(tb.primary_title) LIKE '%" + title.toUpperCase() + "%'";

    if (year) {
        titleSQL += " AND start_year=" + year;
    }

    return query(titleSQL)
        .then(titleResults => {
            return new Promise((resolve, reject) => {
                let promises = [];

                titleResults.forEach(title => {

                    title.directors = [];
                    title.directorsIds && title.directorsIds.split(",").forEach(directorId => {
                        promises.push(query("SELECT primary_name, birth_year, death_year, primary_profession FROM name_basics WHERE nconst='" + directorId + "'")
                            .then(nameResults => {
                                title.directors.push(nameResults[0]);
                            })
                        )
                    });
                    delete title.directorsIds;

                    title.writers = [];
                    title.writersIds && title.writersIds.split(",").forEach(writerId => {
                        promises.push(query("SELECT primary_name, birth_year, death_year, primary_profession FROM name_basics WHERE nconst='" + writerId + "'")
                            .then(nameResults => {
                                title.writers.push(nameResults[0]);
                            })
                        );
                    });
                    delete title.writersIds;

                    title.principals = [];
                    promises.push(query("SELECT ordering, nconst, category, job, characters FROM title_principals WHERE tconst='" + title.tconst + "'")
                        .then(principalsResults => {
                            principalsResults.forEach(principal => {
                                promises.push(query("SELECT primary_name, birth_year, death_year, primary_profession FROM name_basics WHERE nconst='" + principal.nconst + "'")
                                    .then(nameResults => {
                                        title.principals.push(nameResults[0]);
                                    })
                                );
                            })
                        }))
                });

                Promise.all(promises)
                    .then(() => {
                        resolve(titleResults);
                    });
            })
        })
}