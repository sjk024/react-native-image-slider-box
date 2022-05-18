import React, {Component} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  TouchableHighlight,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Text
} from 'react-native';
import SmallCircleButton from '../../../component/button/SmallCircleButton';
import Carousel, {Pagination} from 'react-native-snap-carousel'; //Thank From distributer(s) of this lib
import { Entypo, FontAwesome } from '@expo/vector-icons';
import styles from './SliderBox.style';

// -------------------Props--------------------
// images
// onCurrentImagePressed
// sliderBoxHeight
// parentWidth
// dotColor 
// inactiveDotColor
// dotStyle
// paginationBoxVerticalPadding
// circleLoop
// autoplay
// ImageComponent
// ImageLoader
// paginationBoxStyle
// resizeMethod
// resizeMode
// ImageComponentStyle,
// imageLoadingColor = "#E91E63"
// firstItem = 0
// activeOpacity

const width = Dimensions.get('window').width;

export class SliderBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImage: props.firstItem || 0,
      loading: [],
      imagePressed:false,
    };
    this.onCurrentImagePressedHandler = this.onCurrentImagePressedHandler.bind(this);
    this.onSnap = this.onSnap.bind(this);
    this._renderItem = this._renderItem.bind(this);
  }

  componentDidMount() {
    //let a = [...Array(this.props.images.length).keys()].map((i) => false);
  }

  onCurrentImagePressedHandler() {
    if (this.props.onCurrentImagePressed) {
      this.props.onCurrentImagePressed(this.state.currentImage);
    }
  }

  onSnap(index) {
    const {currentImageEmitter} = this.props;
    this.setState({currentImage: index}, () => {
      if (currentImageEmitter) {
        currentImageEmitter(this.state.currentImage);
      }
    });
  }
  pressHandler = () => {
    this.setState({
      imagePressed:!this.state.imagePressed,
    })
  }

  _renderItem({item, index}) {
    const {
      ImageComponent,
      ImageComponentStyle = {},
      LoaderComponent,
      sliderBoxHeight,
      disableOnPress,
      resizeMethod,
      resizeMode,
      imageLoadingColor = '#E91E63',
      underlayColor = "transparent",
      activeOpacity=0.85,
      poomCustom,
      closeModal,
    } = this.props;

    
  
    return (
      <View
        style={{
          position: 'relative',
          justifyContent: 'center',
        }}>
        <TouchableHighlight
          key={index}
          underlayColor={underlayColor}
          disabled={disableOnPress}
          onPress={poomCustom ? this.pressHandler : this.onCurrentImagePressedHandler}
          activeOpacity={activeOpacity}
        >

         {poomCustom ? 
         (
          <ImageBackground
            source={poomCustom ? {uri: item.pic} : item}
            style={{
              width:'100%',
              height:'100%'
            }}
          >
            <View style={{flex:1, backgroundColor: this.state.imagePressed ? 'rgba(0,0,0,0.65)' : 'transparent'}}>
              <View style={{flex:1,padding:25, flexDirection:'row', justifyContent:'space-between'}}>
                <SmallCircleButton
                  diameter={30}
                  color={'#fff'}
                  icon={<Entypo name="cross" size={24} color="black" />}
                  onPress={closeModal}
                />
                {this.state.imagePressed && <SmallCircleButton
                  diameter={30}
                  color={'#fff'}
                  icon={<FontAwesome name="trash-o" size={24} color="black" />}
                  // onPress={closeModal}
                />}
              </View>
              <View style={{flex:1,}}></View>
              <View style={{flex:1, justifyContent:'center', padding:30}}>
                {this.state.imagePressed && <Text style={{fontSize: 30,color:'#fff',}}>{item.title}</Text>}
              </View>
            </View>
          </ImageBackground>
         )
         :
          (
            <ImageComponent
              style={[
                {
                  width: '100%',
                  height: sliderBoxHeight || 200,
                  alignSelf: 'center',
                },
                ImageComponentStyle,
              ]}
              source={typeof item === 'string' ? {uri: item} : item}
              resizeMethod={resizeMethod || 'resize'}
              resizeMode={resizeMode || 'cover'}
              //onLoad={() => {}}
              //onLoadStart={() => {}}
              onLoadEnd={() => {
                let t = this.state.loading;
                t[index] = true;
                this.setState({loading: t});
              }}
              {...this.props}
            />
          )
        }
        </TouchableHighlight>
        {!this.state.loading[index] && (
          <LoaderComponent
            index={index}
            size="large"
            color={imageLoadingColor}
            style={{
              position: 'absolute',
              alignSelf: 'center',
            }}
          />
        )}
      </View>
    );
  }

  get pagination() {
    const {currentImage} = this.state;
    const {
      images,
      dotStyle,
      dotColor,
      inactiveDotColor,
      paginationBoxStyle,
      paginationBoxVerticalPadding,
    } = this.props;
    return (
      <Pagination
        borderRadius={2}
        dotsLength={images.length}
        activeDotIndex={currentImage}
        dotStyle={dotStyle || styles.dotStyle}
        dotColor={dotColor || colors.dotColors}
        inactiveDotColor={inactiveDotColor || colors.white}
        inactiveDotScale={0.8}
        carouselRef={this._ref}
        inactiveDotOpacity={0.8}
        tappableDots={!!this._ref}
        containerStyle={[
          styles.paginationBoxStyle,
          paginationBoxVerticalPadding
            ? {paddingVertical: paginationBoxVerticalPadding}
            : {},
          paginationBoxStyle ? paginationBoxStyle : {},
        ]}
        {...this.props}
      />
    );
  }

  render() {
    const {
      images,
      circleLoop,
      autoplay,
      parentWidth,
      loopClonesPerSide,
      autoplayDelay,
      useScrollView
    } = this.props;
    return (
      <View>
        <Carousel
          autoplayDelay={autoplayDelay}
          layout={'default'}
          useScrollView={useScrollView}
          data={images}
          ref={(c) => (this._ref = c)}
          loop={circleLoop || false}
          enableSnap={true}
          autoplay={autoplay || false}
          itemWidth={parentWidth || width}
          sliderWidth={parentWidth || width}
          loopClonesPerSide={loopClonesPerSide || 5}
          renderItem={this._renderItem}
          onSnapToItem={(index) => this.onSnap(index)}
          {...this.props}
        />
        {images.length > 1 && this.pagination}
      </View>
    );
  }
}

const colors = {
  dotColors: '#BDBDBD',
  white: '#FFFFFF',
};

SliderBox.defaultProps = {
  ImageComponent: Image,
  LoaderComponent: ActivityIndicator
};