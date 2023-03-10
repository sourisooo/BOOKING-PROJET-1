import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import { getRoomDetails } from '../redux/actions/RoomActions';
import { IRoom } from '../interfaces/IRoom';
import Loader from '../components/Loader';
import { Container, Row, Col, Carousel, Button, Card } from 'react-bootstrap';
import FormReview from '../components/FormReview';
import Message from '../components/Message';
import Rating from '../components/Rating';
import { checkRoomBooking } from '../redux/actions/BookingActions';
import ListReviews from '../components/ListReviews';
import RoomFeatures from '../components/RoomFeatures';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { Link } from 'react-router-dom';
import { CHECK_ROOM_BOOKING_RESET, CREATE_BOOKING_RESET } from '../redux/constants/BookingConstants';
import axios from 'axios';
import { PayPalButton } from "react-paypal-button-v2";
import { createBooking } from '../redux/actions/BookingActions';
import { getBookedDates } from '../redux/actions/BookingActions';
import { IBooking } from '../interfaces/IBooking';


type TId = {
    id: IRoom['_id']
}

declare global {
    interface Window {
        paypal:any;
    }
}

const RoomDetailsScreen = () => {

    const { loggedIn } = useAuthStatus();

    const [checkInDate, setCheckInDate] = useState<IBooking['checkInDate']>();
    const [checkOutDate, setCheckOutDate] = useState<IBooking['checkOutDate']>();
    const [daysOfStay, setDaysOfStay] = useState<IBooking['daysOfStay']>(0);

    const [sdkReady, setSdkReady] = useState<Boolean>(false);

    const { id } = useParams<TId>();

    const dispatch = useDispatch();

    const { loading, room, error } = useSelector((state: RootStateOrAny) => state.roomDetails);

    const { loading: loadingCreateReview, success: successCreateReview, error: errorCreateReview } = 
    useSelector((state: RootStateOrAny) => state.roomCreateReview);

    const { loading: loadingRoomIsAvailable, success: successRoomIsAvailable, error: errorRoomIsAvailable }
    = useSelector((state: RootStateOrAny) => state.roomBookingCheck);

    const { loading: loadingBookingCreate, success: successBookingCreate, error: errorBookingCreate } 
    = useSelector((state: RootStateOrAny) => state.bookingCreate);

    const {bookedDates} = useSelector((state: RootStateOrAny) => state.bookedDates);

    useEffect(() => {

        const addPaypalScript = async () => {
            const { data: clientId } = await axios.get("/api/config/paypal");
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            };
            document.body.appendChild(script);
        };

        if (!window.paypal && !successBookingCreate) {
            addPaypalScript();
        } else {
            setSdkReady(true);
        }

        dispatch(getRoomDetails(id as string));
        dispatch(getBookedDates(id as string));
        dispatch({ type: CHECK_ROOM_BOOKING_RESET });
        dispatch({ type: CREATE_BOOKING_RESET });
    }, [dispatch, id]);

    const onChange = (dates: any) => {
        const [checkInDate, checkOutDate] = dates;
        setCheckInDate(checkInDate as Date);
        setCheckOutDate(checkOutDate as Date);

        if (checkInDate && checkOutDate) {

            // Calclate days of stay

            const days = Math.abs(checkInDate - checkOutDate) / (1000 * 60 * 60 * 24);

            setDaysOfStay(days);

            dispatch(checkRoomBooking(id as string, checkInDate.toISOString(), checkOutDate.toISOString()));

        }

    }

    const excludedDates: any[] = []
    bookedDates?.forEach((date: Date) => {
        excludedDates.push(new Date(date))
    })

    const successPaymentHandler = (paymentResult: any) => {
            
        const amountPaid = Number(room.pricePerNight) * Number(daysOfStay);

        const paymentInfo = {
            id: paymentResult.id,
            status: paymentResult.status,
            update_time: paymentResult.update_time,
            email_address: paymentResult.payer.email_address,
        }

        const bookingData = {
            room: id,
            checkInDate, 
            checkOutDate, 
            amountPaid, 
            paymentInfo,
            daysOfStay,
        }

        dispatch(createBooking(bookingData));
        dispatch(getBookedDates(id as string));
        dispatch({ type: CHECK_ROOM_BOOKING_RESET });
        dispatch({ type: CREATE_BOOKING_RESET });

    }

  return (
      <Container className="pb-4">
        <Row>
            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <Col>
                    <h1 className="mb-2">{room.name}</h1>
                    <span className="d-block mb-2">{room.address}</span>
                    <Rating reviews={room.ratings} />
                    <div className="carousel-room mt-3 mb-3">
                        <Carousel>
                            {room.images?.map((img: any) =>
                                <Carousel.Item key={img._id}>
                                    <img
                                        className="d-block w-100"
                                        src={img.image}
                                        alt={img._id}
                                    />
                                </Carousel.Item>
                            )}
                        </Carousel>
                    </div>
                    <Row>
                        <Col xs={12} sm={12} md={8}>
                            <h3>Description</h3>
                            <p>
                                {room.description}
                            </p>

                            <RoomFeatures room={room} />

                            <h4 className="mt-3 mb-4">Reviews</h4>

                            {errorCreateReview && <Message variant="danger">{errorCreateReview}</Message>}
                            {successCreateReview && <Message variant="success">Added Review</Message>}
                            
                            <FormReview idRoom={room._id} />
                            
                            <hr />
                            {loadingCreateReview && <Loader />}

                            <ListReviews roomReviews={room.reviews} />

                        </Col>
                        <Col xs={12} sm={12} md={4}>
                            <Card className="shadow p-3 mb-5 bg-body rounded">
                                <Card.Body>
                                    <Card.Title>${room.pricePerNight} / Per Night</Card.Title>
                                    <hr />
                                    <p className="mb-3">Pick Check In & Check Out Date</p>
                                    <DatePicker
                                        dateFormat="DD-MM-YYYY"
                                        className='w-100'
                                        selected={checkInDate}
                                        onChange={onChange}
                                        startDate={checkInDate}
                                        endDate={checkOutDate}
                                        minDate={new Date()}
                                        excludeDates={excludedDates}
                                        selectsRange
                                        inline
                                    />
                                    {loadingRoomIsAvailable && <Loader />}
                                    {successRoomIsAvailable && <Message variant="success">Room Is Available</Message>}                               
                                    {errorRoomIsAvailable && <Message variant="danger">{errorRoomIsAvailable}</Message>}

                                    {loggedIn && successRoomIsAvailable && ( 
                                        <Button size="lg" variant="primary" className="mb-3">
                                            Pay ${Number(room.pricePerNight) * Number(daysOfStay)}
                                        </Button>
                                     )}

                                     {!sdkReady && <Loader />}

                                     {loggedIn && successRoomIsAvailable && sdkReady && !successBookingCreate && (
                                        <PayPalButton
                                            amount={Number(room.pricePerNight) * Number(daysOfStay)}
                                            onSuccess={successPaymentHandler}
                                        />
                                     )}

                                     {!loggedIn && !successRoomIsAvailable && (
                                        <Message variant="info">
                                            Please <Link to="/login">Sign In</Link> for booking
                                        </Message>
                                     )}
                                
                                     {successBookingCreate && (
                                        <Message variant="success">
                                            Your booking has been paymented
                                        </Message>
                                     )}

                                     {errorBookingCreate && (
                                        <Message variant="success">
                                            {errorBookingCreate}
                                        </Message>
                                     )}

                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            )}
        </Row>
      </Container>
  );
};

export default RoomDetailsScreen;

//Commentaires
//La fonction RoomDetailsScreen invoque la fonction useAuthStatus pour la destructurer et utiliser et acc??der ses param??tres.
//Plusieurs variables utilisant la fonctionnalit?? useState de react sont sp??cifi??es. Puis plusieurs reducers sont invoqu??es
//puis destructurer pour acc??der et utiliser leurs param??tres, ces reducers ??tant roomDetails, roomCreateReview,
//roomBookingCheck, bookingCreate, bookedDates.
//La fonctionnalit?? useEffect est utilis??e de tel mani??re ?? chaque usage d'un reducer ou de la modification d'un id, les fonctions
//utilisant les ressources du reducer sont utilis??s tel que les fonctions getRoomDetails et getBookedDates et la r??alisation
//des deux sc??nariis dispatch({ type: CHECK_ROOM_BOOKING_RESET }), dispatch({ type: CREATE_BOOKING_RESET }). Le param??tre en entr??e
//de ses fonctions ??tant l'id de la room actuel, sp??cifi??e par  const { id } = useParams<TId>().
//La fonction onChange prend pour entr??e de fonction une date, puis les variables checkin et checkout ont modifi?? ?? travers leurs
//m??thodes SET respectifs, l'affectation de l'entr??e de fonction vers les m??thodes SET ??tant rendu possible par la destructuration
//de l'objet date. Puis le reducer checkRoomBooking est appel?? en utilisant les param??tres pr??cedemment cit??s.
//La fonction successPaymentHandler prend pour entr??e un objet non sp??cifi?? puis d??termine les valeurs des variables de l'objet
//paymentInfo tandis ce que les valeurs des variables de bookingData sont d??termin??s par les param??tres pr??cedemment cit??s.
//Puis un reducer, une fonction utilisant les ressource d'un reducer et deux scenariis de reducer sont appel??s en utilsant
//des variables ou param??tres pr??c??demment d??termin??s.
//La fonction RoomDetailsScreen retourne un template HTML en utilisant les param??tres pr??cit??s ainsi que plusieurs composants
//qui ont ??t?? d??ja ??t?? analys?? dans leur feuille de code respectif: RoomFeatures, FormReview, ListReviews.
//What is datepicker in JavaScript?
//The JavaScript DatePicker (Calendar Picker) is a lightweight and mobile-friendly control that allows end users to enter or select a date value.
// It has month, year, and decade view options to quickly navigate to the desired date.
