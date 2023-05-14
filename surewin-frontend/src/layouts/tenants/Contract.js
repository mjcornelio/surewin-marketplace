import { Grid, Typography } from "@mui/material";
import React from "react";
import { fCurrency } from "src/utils/formatNumber";
import { fDateWord } from "src/utils/formatTime";
const Contract = React.forwardRef(({ contract, tenant }, ref) => {
  return (
    <div
      style={{ padding: "40px", lineHeight: "30px", fontSize: "10pt" }}
      ref={ref}
    >
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\nhtml, body {\n    height: 130%;\n   \n}\n\nhtml {\n    display: table;\n    margin: auto;\n}\n\nbody {\n    display: table-cell;\n    vertical-align: middle;\n}\n.title {\n    text-align: center;\n}\n\np {\n    text-align: justify;\n}\n\n.par{\n    text-indent: 40px;\n}\ntable{\n    border-spacing: 0px;\n}\ntd{\n    vertical-align: top;\n}\n\n.num{   \n    padding-right: 10px;\n}\n.sign{\n    padding-right: 370px;\n}\n",
        }}
      />
      <h3 className="title">KASUNDUAN SA PAGPAPAUPA</h3>
      <p>HAYAG SA SINUMANG MAKAKABASA NITO:</p>
      <p className="par">
        Ang KASULAANG ito ay isinagawa at nilagdaan sa pagitan nina: Si EUFEMIA
        JOSON, nasa hustong gulang, naninirahan sa Zone 2 Robes 2 Brgy.
        Graceville City of San Jose Del Monte Bulacan, at dito ay kikilalanin
        bilang NAGPAPAUPA. Si <u>{tenant.firstname + " " + tenant.lastname}</u>,
        nasa hustong gulang, naninirahan sa
        <u>
          {tenant.street_address +
            " " +
            tenant.barangay +
            " " +
            tenant.city +
            " " +
            tenant.province}
        </u>{" "}
        , at dito ay kikilalanin bilang UMUUPA.
      </p>
      <h4 className="title" style={{ marginTop: "20px" }}>
        NAGSASALAYSAY
      </h4>
      <p className="par">
        1. Na ang NAGPAPAUPA ang siyang nangangasiwa ng SURE WIN MARKETPLACE na
        matatagpuan sa L-38-G-27-B-9 Gov. Fortunato Halili Avenue, Brgy.
        Tungkong Mangga,
      </p>
      <p className="par">
        2. Na ang UMUUPA ay nagnanais na upahan ang {contract.stall}. Ayon sa
        sumusunod na kaayusan:
      </p>

      <table style={{ paddingLeft: "80px" }}>
        <tbody>
          <tr>
            <td className="num">
              <p>a.</p>
            </td>
            <td>
              <p>
                Na ang UMUUPA ay tatagal ng ISANG TAON na magsisimula ngayong
                <u> {fDateWord(contract.start_date)} </u> hanggang
                <u> {fDateWord(contract.end_date)} </u> (not renewable); Maari
                lang itong irenew ng panibagong kasunduan kung ito ay
                papahintulutan pa ng NAGPAPAUPA.
              </p>
            </td>
          </tr>
          <tr>
            <td className="num">
              <p>b.</p>
            </td>
            <td>
              <p>
                Na ang renta sa nasabing Stall ay nagkakahalaga ng
                <u> ₱ {fCurrency(contract.rental_amount)} </u> kada isang araw.
              </p>
            </td>
          </tr>
          <tr>
            <td className="num">
              <p>c.</p>
            </td>
            <td>
              <p>
                Na ang UMUUPA ay kusang loob na magbibigay ng isang buwang
                deposito na nagkakahalaga ng
                <u> ₱ {fCurrency(contract.deposit)}</u> . At ito ay hindi
                maaaring gamitin bilang kabayaran sa pang araw-araw na bayad sa
                renta.
              </p>
            </td>
          </tr>
          <tr>
            <td className="num">
              <p>d.</p>
            </td>
            <td>
              <p>
                Na kung sakali man na hindi magbukas o makapagtinda ang UMUUPA
                sa anumang kadahilanan, ang renta sa pwesto ay kailangan pa din
                niyang bayaran.
              </p>
            </td>
          </tr>
          <tr>
            <td className="num">
              <p>e.</p>
            </td>
            <td>
              <p>
                Na kung sakaling may masira sa pag-aari ng NAGPAPAUPA ito ay
                nararapat lamang na bayaran ng UMUUPA.
              </p>
            </td>
          </tr>
          <tr>
            <td className="num">
              <p>f.</p>
            </td>
            <td>
              <p>
                Na anu mang mawala at masira ng dahil sa kalamidad o kapabayaan
                ng UMUUPA ay walang pananagutan ang NAGPAPAUPA.
              </p>
            </td>
          </tr>
          <tr>
            <td className="num">
              <p>g.</p>
            </td>
            <td>
              <p>
                Na ang pwestong nirentahan ng UMUUPA ay hindi maaaring ipasa o
                ipagamit sa iba ng walang pahintulot ng NAGPAPAUPA. At kung ito
                man ay mangyari sa hinaharap, ito ay magreresulta ng agarang
                pagpapaalis sa kanilang nirerentahang pwesto, kasama na din dito
                ang pagkawalang bisa ng kasunduan.
              </p>
            </td>
          </tr>
          <tr>
            <td className="num">
              <p>h.</p>
            </td>
            <td>
              <p>
                Na ang tanging may Karapatan lamang sa nasabing lugar ay ang
                NAGPAPAUPA.
              </p>
            </td>
          </tr>
          <tr>
            <td className="num">
              <p>i.</p>
            </td>
            <td>
              <p>
                Na mahigit na ipinagbabawal ang pag gamit ng droga o bawal na
                gamut at anumang uri ng bagay na maling gawain o kaguluhan sa
                loob ng inuupahang lugar.
              </p>
            </td>
          </tr>
          <tr>
            <td className="num">
              <p>j.</p>
            </td>
            <td>
              <p>
                Na tinitiyak ng UMUUPA na siya’y hindi gagawa ng anumang
                pagbabago at pagsasaayos ng lugar ng inuupahan niya ng walang
                pahintulot ng NAGPAPAUPA.
              </p>
            </td>
          </tr>
          <tr>
            <td className="num">
              <p>k.</p>
            </td>
            <td>
              <p>
                Na pananatilihing malinis, kaaya-aya at maayos ang nasabing
                pwesto ng UMUUPA at papayagan niya ang NAGPAPAUPA o sinumang
                kinatawan na bisitahin at inspeksiyonin kung kinakailangan ang
                nasabing pwesto sa resonableng araw at oras.
              </p>
            </td>
          </tr>
          <tr>
            <td className="num">
              <p>l.</p>
            </td>
            <td>
              <p>
                Na sa sandalling matapos na ang kontratang ito, ang UMUUPA ay
                aalis ng kusang loob.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="par">
        3. Na ang UMUUPA na may lisensya sa pagtitinda at susunod sa lahat ng
        patakaran o reglamento ng Pamahalaang Bayang ng San Jose Del Monte,
        gayon din sa Panlalawigan ng Bulacan at Pambansang Pamahalaan sa malinis
        at maayos na pamamalakad nito sa loob ng pamilihan.
      </p>
      <p className="par">
        4. Na Ang UMUUPA ang siyang mananagot sa gastos ng ilaw, tubig, basura
        at sa mga pang araw-araw na kasiraan ng lugar ng kaniyang pwesto.
      </p>
      <p className="par">
        5. Na ang magkabilang panig ay nagkasundo na tutuparin at susundin ang
        lahat ng nakasaad dito na kaayusan.
      </p>
      <br />
      <br />
      <p className="par" style={{ marginTop: "-20px" }}>
        At sa katunayan ng lahat ng ito, ang mag-kabilang panig ay nagkasundo at
        lumagda ngayong ika-<u>_____ </u> ng <u>______ </u>, 20<u>___ </u>, dito
        sa Tungkong Mangga, City of San Jose Del Monte, Bulacan.
      </p>
      <br />
      <p className="title">N I L A G D A A N :</p>
      <br />
      <Grid container>
        <Grid item xs={6} sx={{ textAlign: "center" }}>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", fontSize: "10pt" }}
          >
            <u>____Eufemia_Joson____</u>
          </Typography>
          <Typography variant="h6" style={{ fontSize: "10pt" }}>
            NAGPAPAUPA
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "center" }}>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            <u>____{tenant.firstname + "_" + tenant.lastname}___</u>
          </Typography>
          <Typography variant="h6" style={{ fontSize: "10pt" }}>
            UMUUPA
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
});

export default Contract;
