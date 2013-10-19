/**
 * Template js pour créer une carte Google Maps
 *
 * Params :
 * - conteneur html
 * - coordonnées du marker
 * - icones du marker
 * - infobulle
 * - coordonnées du centre de la map
 * - thème
 * - events
 */

if(typeof(google) != "undefined")
{
	//Le bloc html contenant la carte
	var container = document.getElementById("googleMaps");

	//Coordonnées du point marker
	var lat = 00,
		lng = 00;

	//Coordonnées du centre
	var latC = 00,
		lngC = 00;

	//Markeur
	var marker      = "My Marker";
	var icone       = false;
	var shadowicone = false;
	//var icone       = 'http://mysite/google-maps.png';
	//var shadowicone = 'http://mysite/maps-shadow-icone.png';
	

	//Infobulles
	var contentIWS = false;
	//var contentIWS = '<div class="infoBulleIWS"></div>';
	//var infoIWS = new google.maps.InfoWindow(); 

	//Style
	var styles = false;
/*
	//Black&White
	var styles = {
		'monTheme': [
		{
			featureType: 'all',
			stylers: [
				{saturation: -100},
				{gamma: 0.50}
			]
		}
	]};
*/
	//Enable visualRefresh
	//@see https://developers.google.com/maps/documentation/javascript/basics?hl=fr#EnableVisualRefresh
	google.maps.visualRefresh = true;


	//Le lieu
	var IWSpos  = new google.maps.LatLng(lat, lng); 

	/* Options */
	var options = {
		center: new google.maps.LatLng(latC, lngC),// centre initial de la carte (coordonnées GPS)

		zoom: 10, // niveau du zoom par d�faut

		mapTypeId: google.maps.MapTypeId.ROADMAP, //Type de carte

		mapTypeControl: false, //affichage du sélecteur du mode de rendu
		
		navigationControl: true, //affichage du panneau de navigation : Small

		streetViewControl: true
	}; 

	if(styles) {
		options.navigationControl = {
			style: google.maps.NavigationControlStyle.SMALL
		};
		options.mapTypeId = 'monTheme';
	}  


	//On crée la carte
	var carte = new google.maps.Map(container, options);

	//On ajoute les styles
	if(styles) {
		var styledMapType = new google.maps.StyledMapType(styles['monTheme'], {name: 'monTheme'});
		carte.mapTypes.set('monTheme', styledMapType);
	}

	//Markeurs
	if(marker) {

		var iconIWS = new google.maps.Marker({
			position : IWSpos,
			map      : carte,
			title    : marker,
			icon     : (icone) ? icone : false,
			shadow   : (shadowicone) ? shadowicone : false , 
		});

		//Évènements infobulle
		if(contentIWS) {
			//Quand click sur l'icône, on ouvre l'info bulle
			google.maps.event.addListener(iconIWS, 'click', function() {
				infoIWS.setContent(contentIWS);
				infoIWS.open(carte, this);
				carte.panTo(IWSpos);
			}); 
			//Quand click sur la map, on ouvre l'info bulle
			google.maps.event.addListener(carte, 'click', function() {
			  carte.panTo(IWSpos);
			  infoIWS.setContent(contentIWS);
			  infoIWS.open(carte, iconIWS);
			});  
		}  

	}
   
	//Évènements sur liens html contenu dans infobulle
	if(contentIWS) {
		$('#lienIWS').click(function(){
			carte.panTo(IWSpos);
			infoIWS.setContent(contentIWS);
			infoIWS.open(carte, iconIWS);
		});
	}
}
