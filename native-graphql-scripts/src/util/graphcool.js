export default async function () {
    try {
        console.log('Im in frenzy!');
        return { success: 'sapo cururu' };
    }
    catch (e) {
        console.log(e);
        return { error: true };
    }
}