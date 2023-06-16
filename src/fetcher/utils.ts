import axios from "axios";

const c4_CONTESTS_URL = "https://code4rena.com/contests";

export const getContents = async () => {
    const { data } = await axios.get(c4_CONTESTS_URL);

    const cleanedData = cleanData(data);
}


const cleanData = (data: string) => {
    const rawData = data.replace(/\\"/g, '');
    const rawContests = rawData.split(`{contests:[`)[1].split(`}]}]}]}]`)[0] + `}`;

    const extractedData = rawContests.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:\s?([^,\[\]{}]+)/g, (match, p1, p2, p3, p4) => {
        if (p4.startsWith('{') || p4.startsWith('[')) {
            return `"${p2}": ${p4}`;
        } else if (p4.startsWith('$$')) {
            const value = p4.replace(/^\$\$(.*),(.*)$/, '" $1$2"').replace(/,/g, ''); // Add leading space and wrap the value in double quotes, then remove commas
            return `"${p2}": ${value}`;
        } else {
            return `"${p2}": "${p4}"`;
        }
    });

    const cleanedData: any = []
    const arrayData = extractedData.split('},{');

    for (let i = 0; i < arrayData.length; i++) {
        const _data = arrayData[0];
        const quotedKeysData = _data.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3') + '}';
        const formattedData = quotedKeysData.replace(/"formatted_amount":.*,"total_award_pool"/, '"formatted_amount":"","total_award_pool"').replace(/"amount":.*,"codeAccess"/, '"amount":"","codeAccess"').replace(/`/g, '{').replace(/`/g, '}');
        cleanedData.push(JSON.parse(formattedData));
    }

    console.log(cleanedData)

    return cleanedData;

}