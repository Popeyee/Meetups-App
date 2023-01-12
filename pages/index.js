import Head from 'next/head';
import { MongoClient } from "mongodb";
import Layout from "../components/layout/Layout";
import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from 'react';


 
const HomePage = (props) => {
    return (
    <Fragment>
        <Head>
            <title> React Meetups</title>
            <meta 
                name="description" 
                content=" Browse a huge list of highly active meetups" 
            />
        </Head>
        <MeetupList meetups={props.meetups} />
    </Fragment>
    )
}


export const getStaticProps = async () => {

    // fetch data from an API
    const client = await MongoClient.connect(
        'mongodb+srv://ali:Cv5fnfJ1Jt6iFLMj@cluster0.9k5iw29.mongodb.net/meetups?retryWrites=true&w=majority'
    );

    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find().toArray();

    client.close();

    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString()
            })),
        },
        revalidate: 1
    };
}


// export const getServerSideProps = async(context) => {
//     const req = context.req;
//     const res = context.res;

//     // fetch data from API

//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }




export default HomePage;