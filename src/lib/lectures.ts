import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const lecturesDirectory = path.join(process.cwd(), 'lectures')


const getAllLectureRelativePaths = () => {
    let foundSubPaths = [];
    const readDir = dir => {
        const absdir = path.join(lecturesDirectory, dir);
        const contents = fs.readdirSync(absdir);
        const fileNames = contents.filter(item => fs.lstatSync(path.join(absdir, item)).isFile());
        foundSubPaths = foundSubPaths.concat(fileNames.map(fileName => `${dir}/${fileName}`));
        const subdirs = contents.filter(item => fs.lstatSync(path.join(absdir, item)).isDirectory());
        subdirs.forEach(subdir => readDir(path.join(dir, subdir)));
    };

    readDir(".");
    return foundSubPaths;
};

export function getAllLectureIds() {
    const foundSubPaths = getAllLectureRelativePaths();
    return foundSubPaths.map(relativePath => {
        return relativePath.replace(/\.md$/, '')
    });
};


export function getLecturesDataByTier() {
    const ids = getAllLectureIds();
    const allLecturesData = ids.map(getLectureMetadata);

    const tiers = [];
    let max = 0;
    for ( let lectureData of allLecturesData ) {
        const index = lectureData.tier - 1;
        if ( !tiers[index] ) {
            tiers[index] = [];
        }
        tiers[index].push(lectureData);
        max = Math.max(max, index);
    }

    for ( let i = 0; i < max + 1; i++ ) {
        if ( !tiers[i] ) {
            tiers[i] = [];
        }
        tiers[i].sort((a, b) => {
            if ( a.topic < b.topic ) {
                return -1;
            } else if ( a.topic > b.topic ) {
                return 1;
            }

            if ( a.number < b.number ) {
                return -1;
            } else if ( a.number > b.number ) {
                return 1;
            }

            return 0;
        });
    }

    return tiers;
};


export function getAllLectureParams() {
    const foundIds = getAllLectureIds();
    return foundIds.map(id => {
        return {
            params: {
                id: id.split('/')
            }
        };
    });
};


const extractLectureMetaData = fileContents => {
    const matterResult = matter(fileContents);

    return {
        ...(matterResult.data as { date: string; title: string })
    };
};


const extractLectureContent = async (fileContents) => {
    // Use gray-matter to parse the lecture metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);

    return processedContent.toString();
};

export function getLectureMetadata(id: string) {
    const fullPath = path.join(lecturesDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const metadata = extractLectureMetaData(fileContents);
    return {
        id,
        ...metadata,
    };
};


export async function getLectureData(id: string) {
    const fullPath = path.join(lecturesDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const metadata = extractLectureMetaData(fileContents);
    const contentHtml = await extractLectureContent(fileContents);

    // Combine the data with the id and contentHtml
    return {
        id,
        contentHtml,
        ...metadata
    };
};
