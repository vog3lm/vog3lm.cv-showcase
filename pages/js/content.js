
function IndexProtectedContent(){
	this.get = (index) => {
		switch(index){
			case 0:return this.landing;
			case 1:return this.about;
			case 2:return this.expa;
			case 3:return this.edub;
			case 4:return this.edua;
			case 5:return this.edua;
			default: return {'title':'restricted','text':'restricted'}
		}
	};

	this.landing = {'text':'Sehr geehrter Herr Mustermann\nIhr Stellenangebot hört sich toll an! In den Medien habe ich Ihre Entwicklung seit der Neuausrichtung 2010 verfolgt. Daher erachte ich die Bundeswehr inzwischen als sehr interessanten Arbeitgeber. Ich bin mir sicher, dass die künftige Rolle der Bundeswehr auf internationalem Parket außerst interessante Herausforderungen mit sich bringt. Ich hoffe, damit meine fachliche und vor allem persönliche Entwicklung vorantreiben zu können.\nIn eine neue Aufgabe bei Ihnen kann ich verschiedene Stärken einbringen. Aus meinen Arbeitszeugnissen, können Sie entnehmen, dass ich verantwortungsbewusst, effizient und zuverlässig arbeite. Mit mir gewinnt Ihre Behörde eine flexibele, motivierte, belastbare und kreative Arbeitskraft. Mit Hilfe der Lehrtätigkeiten konnte ich mir eine ausgeprägte Kommunikationsstärke und teamorientiertheite Führungsqualitäten aneignen.\nKonnte ich Sie mit dieser Bewerbung überzeugen? Ich bin für einen Einstieg zum nächstmöglichen Zeitpunkt verfügbar. Einen vertiefenden Eindruck gebe ich Ihnen gerne in einem persönlichen Gespräch. Ich freue mich über Ihre Einladung!\nGerne können Sie sich, mit Hilfe meines github repositories bzw. der Dokumentation zu dieser Website, von meinen praktischen Kenntnissen und Fähigkeiten  überzeugen.'}
	this.about = {'text':['woher ich komme\nlebenssituation\ninteressen\n']}
	this.expa = {'text':[['sh','images/logo.sh_simple.png','2013','2014','Shülerhilfe Weingarten','Honorarlehrer'
								   ,'laut und widerspenstig, weigert sich zu essen']
								,['zf','images/logo.zf.dark.png','2013','2013','Shülerhilfe Weingarten','Software Developer'
								   ,'still und folgsam, arbeitet zuviel']
								,['fh','images/logo.fh_simple.png','2010','2014','Shülerhilfe Weingarten','Mitarbeiter'
								   ,'Tutor in Analysis I und II, lineare Algebra, Statistik\n12 Monate hilfswissenschaftlichen Tätigkeiten.']
								,['rhk','images/logo.rhk_simple.png','2004','2012','Shülerhilfe Weingarten','Service'
								   ,'hat ne zwiebel aufm kopf und isst gern döner']
								,['ksk','images/logo.sh_simple.png','2001','2004','Shülerhilfe Weingarten','IHK Bankkaufmann'
								   ,'scheiss job']
		]};
	this.edub = {'text':[['ph','2016','2018','Pädagogische Hochschule Weingarten','M.Ed.','Pädagogik','','','Fachdidaktische Grundlagen\nEinführung in die Erziehungswissenschaften\nKonzepte der beruflichen Bildung\nLernprozesse im technischen Umfeld\nSchulpraxissemester 1\nSchulpraxissemester 2']
							  ,['fb','2015','2018','Hochschule Ravensburg Weingarten','B.Sc. M.Sc.','Wirtschaftsinformatik','','','Analysis 1\nAnalysis 2\nLineare Algebra\nStatistik und Wirtschaftsmathematik<br>\nDatenbanksysteme (SQL)\nDatenbanksysteme Praktikum (SQL)\nGrundlagen der Informatik\nInternet und verteilte Systeme\nObjektorientierte Programmierung (Java)\nObjektorientierte Programmierung Praktikum (Java)\nProgrammieren (Java)\nProgrammieren Praktikum (Java)\nRechnertechnologien\nSoftware-Engineering\nSoftware-Engineering Praktikum (Java)\nWebtechniken (HTML, CSS, JS)<br>\nCustomer Relationship Management\nEinführung in die Wirtschaftsinformatik und E-Business 1\nEinführung in die Wirtschaftsinformatik und E-Business 2\nEinführung in die Wirtschaftswissenschaften 1\nEinführung in die Wirtschaftswissenschaften 2\nGeschäftsprozesse und Prozessmodelierung (EPK, BPML)\nMaterial und Logistik\nMarketing\nMikroökonomie\nMakroökonomie\nProduktionsplanungs und Steuerungssysteme\nProjektmanagement\nProjektseminar\n<br>\nRequirements Engeneering und Management\nAdvanced Software Engeneering (JAVA)\nNeuere Entwicklungen im Management\nControlling\nInternational Economics\nQuantitative und Qualitative Methoden der VWL']
							  ,['fa','2010','2014','Hochschule Ravensburg Weingarten','B.Sc.','Informatik','Abschlussarbeit 1,4\nInformatikprojekt 1\nNotendurchschnitt 2,2','cum laude','Analysis 1\nAnalysis 2\nLineare Algebra\nStatistik\n\nBetriebssysteme\nDatenbanksysteme (SQL)\nDatenbanksysteme Praktikum (SQL, C)\nDatensicherheit\nDigitaltechnik und elektrotechnische Grundlagen\nEchtzeitprogrammierung\nEchtzeitprogrammierung Praktikum (C)\nEinführung in die Automatisierungstechnik\nGrafische Bedienoberflächen (Java, C++)\nGrafische Bedienoberflächen Praktikum (Java, C++)\nGrundlagen der Informatik\nInternet\nKünstliche Intelligenz Light\nNetzwerktechnologien\nNetzwerktechnologien Praktikum\nObjektorientierte Programmierung (C++)\nObjektorientierte Programmierung Praktikum (C++)\nProgrammieren (C)\nProgrammieren Praktikum (C)\nRechnertechnologie\nRechnertechnologie Praktikum (Assembler)\nRegelungstechnik\nRegelungstechnik Praktikum\nSoftware Engeneering\nSoftware Engeneering Praktikum (HTML, CSS, JS, PHP, SQL)\nSystemadministration\nSystemprogrammierung\nSystemsicherheit\nWeb-Programmierung (HTML, CSS, JS)\nWeb-Programmierung Praktikum (HTML, CSS, JS)\n\nBetriebswirtschaftslehre\nBusiness English 1\nBusiness English 2\nGestaltung von Softwareprodukten\nPräsentationstechniken\nProjektmanagement\nProjektmoderation\nStudienkompetenz 1\nStudienkompetenz 2\n\nDer Studienschwerpunkt lag auf Automatisierungssystemen und Informationsnetzen.\nGegenstand des Informatikprojekts war die Entwicklung einer Echtzeit-Steuersoftware\nfür eine Modelleisenbahn mit Bluetooth.\nThema der Abschlussarbeit war die Evaluierung einer Push Notification Plattform<br>im Rahmen Mobiler Geschäftsprozesse.']
							//   0    1      2      3                      4       5            6  7  8
							  ,['kn','2009','2010','Universität Konstanz','B.Sc.','Mathematik','','','Analysis 1\nAnalysis 2\nlineare Algebra 1\nlineare Algebra 2']
		]};
	this.edua = {'text':[
							   ['wg','2006','2009','Wirtschaftsgymnasium Wangen','Abitur','','Notendurchschnitt 1,4','magna cum laude']
							  ,['bs','2001','2004','Kaufmännische Schulen Wangen','Berufsschule','','Notendurchschnitt 2,1','cum laude']
							  ,['rs','1995','2001','Realschule Leutkich','mittlere Reife','','Notendurchschnitt 2,7','','']
							//   0    1      2      3                           4              5  6                       7                8
							  ,['gs','1991','1995','Grundschule Oberer Graben','Grundbildung','','Notendurchschnitt 1,8','magna cum laude','']
		]};

	this.connect = {'text':''}


}

function IndexOfflineContent(){
	this.get = (index) => {
		switch(index){
			case 0:return this.dummy;
			case 1:return this.dummy;
			case 2:return this.dummy;
			case 3:return this.dummy;
			case 4:return this.dummy;
			case 5:return this.dummy;
			default: return null;
		}
	};

	this.dummy = {'data':['Restricted. Apply for access.'],'type':'test'}
	this.start = {'data':['start text logged out'],'type':'test'}
	this.about = {'data':['about text logged out'],'type':'test'}

	this.exp_a = {'data':['exp_a text logged out'],'type':'test'}
	this.edu_a = {'data':['edu_a text logged out'],'type':'test'}
	this.edu_b = {'data':['edu_b text logged out'],'type':'test'}


}