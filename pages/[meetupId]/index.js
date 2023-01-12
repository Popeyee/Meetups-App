import Head from 'next/head';
import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import MeetupDetail from "../../components/meetups/MeetupDetail";


const MeetupDetails = (props) => {
    return (
        <Fragment>
            <Head>
                <title> {props.meetupData.title}</title>
                <meta 
                    name='description' 
                    content={props.meetupData.description}
                />
            </Head>
            < MeetupDetail 
            image= {props.meetupData.image}
            title= {props.meetupData.title}
            address={props.meetupData.address}
            description= {props.meetupData.description}
        />
        </Fragment>
        
    )
}

export const getStaticPaths = async() => {

    const client = await MongoClient.connect(
        'mongodb+srv://ali:Cv5fnfJ1Jt6iFLMj@cluster0.9k5iw29.mongodb.net/meetups?retryWrites=true&w=majority'
    );

    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find({}, {_id: 1}).toArray();

    client.close();



    return {
        fallback: false,
        paths: meetups.map(meetup => ({ 
            params: { meetupId: meetup._id.toString() },
        }))
    }
};

export const getStaticProps = async(context) => {
    // fetch data for a single meetup

    const meetupId = context.params.meetupId;

    console.log(meetupId);

    const client = await MongoClient.connect(
        'mongodb+srv://ali:Cv5fnfJ1Jt6iFLMj@cluster0.9k5iw29.mongodb.net/meetups?retryWrites=true&w=majority'
    );

    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)})

    client.close();
    

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                image: selectedMeetup.image,
                description: selectedMeetup.description,
                address: selectedMeetup.address
            }
            
        }
    }
}

export default MeetupDetails;