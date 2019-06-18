package jp.co.sample.emp_management.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import jp.co.sample.emp_management.service.UserDetailsServiceImpl;

/**
 * Spring securityの設定を行うためのクラス.
 * 
 * @author Makoto
 *
 */
@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
	
	@Autowired
	private UserDetailsServiceImpl userDetailsService;

	/**
	 * Spring securityの設定.
	 */
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// 常に許可するパス
		http
			.authorizeRequests()
			.antMatchers("/", "/toInsert", "/insert", "/logout").permitAll()
			.anyRequest().authenticated();
		
		// 認証済みじゃないと入れないパス
		http.formLogin()
			.loginProcessingUrl("/login")
			.loginPage("/")
			.defaultSuccessUrl("/employee/showList", true)
			.usernameParameter("mailAddress")
			.passwordParameter("password");
	}

    /**
     * 静的リソースの認証を許可する.
     */
    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/js/**", "/css/**","/img/**");
    }

	/**
	 * パスワードのハッシュ化
	 */
	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService)
		.passwordEncoder(new BCryptPasswordEncoder());
	}
    
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
